"use strict";

import { styles } from './styles';

interface VideoContainer extends HTMLElement {
  // A reference back to this VideoContainer's parent ScrollScrubVideoComponent 
  ScrollScrubVideoComponent: ScrollScrubVideoComponent;
}

interface ComponentData {
  lower: number;
  upper: number;
  video: HTMLVideoElement | null;
}

// Static class members
const componentDataMap = new WeakMap<ScrollScrubVideoComponent, ComponentData>();
let observer: IntersectionObserver;
let staticInitialisationDone = false;

// The active component, if there is one
let activeScrollScrubComponent: ScrollScrubVideoComponent | null;
const allScrollScrubComponents: Set<ScrollScrubVideoComponent> = new Set();
const observedElements: Set<ScrollScrubVideoComponent> = new Set();
const OVERSCRUB_AVOIDANCE_FACTOR = 0.99;


class ScrollScrubVideoComponent extends HTMLElement {
  isHidden: boolean;
  zoomDuration: number;
  video: HTMLVideoElement | null;
  src: string | null;
  isInited: boolean;
  videoContainer: VideoContainer | null;

  constructor() {
    super();

    if (!staticInitialisationDone) {
      ScrollScrubVideoComponent.doStaticInitialisation();
    }

    // Initialise instance members
    this.isHidden = false;
    this.zoomDuration = parseFloat(getComputedStyle(this).getPropertyValue('--zoom-duration') || '0.2s');

    this.video = null;
    this.src = null;
    this.isInited = false;
    this.videoContainer = null;
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.render();
    allScrollScrubComponents.add(this);
    this.isInited = true;
  }

  loadAndObserve() {
    // Get the video element
    this.video = this.shadowRoot!.querySelector("video");
    if (!this.video) {
      return;
    }

    // Preload the video
    this.preloadVideo().then(() => {
      // Setup this scrub-video
      if (this.videoContainer) {
        this.videoContainer.ScrollScrubVideoComponent = this;
        observer.observe(this.videoContainer);
        observedElements.add(this);

        // Update the positions of all scrub-videos
        ScrollScrubVideoComponent.updateAllScrollScrubComponents();
      }
    });
  }

  disconnectedCallback() {
    // Unobserve the video container
    if (this.videoContainer) {
      observer.unobserve(this.videoContainer);
    }
    // Remove this component from the set of observed elements
    observedElements.delete(this);

    // Remove from the set of all scrub video components
    allScrollScrubComponents.delete(this);

    // Update the positions of all scrub-videos
    ScrollScrubVideoComponent.updateAllScrollScrubComponents();
  }

  attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isInited && oldValue !== newValue) {
      // Fade out the video
      this.classList.remove('video-loaded');

      observer.unobserve(this.videoContainer!);

      this.render();
      ScrollScrubVideoComponent.updateAllScrollScrubComponents();
    }
  }


  get minWidth() {
    return parseInt(this.getAttribute('min-width') ?? '0', 10)
  }


  static get observedAttributes() {
    return ["src", "firefox-src", "min-width"];
  }


  static doStaticInitialisation() {
    observer = new IntersectionObserver(ScrollScrubVideoComponent.intersectionObserverCallback, { threshold: 1 });
    document.addEventListener("scroll", ScrollScrubVideoComponent.handleScrollEvent);
    window.addEventListener("resize", ScrollScrubVideoComponent.updateAllScrollScrubComponents);

    staticInitialisationDone = true;
  }

  static intersectionObserverCallback(entries: IntersectionObserverEntry[], _: IntersectionObserver) {
    entries.forEach(entry => {
      const isWithinViewport = entry.intersectionRatio === 1;

      const videoContainer = entry.target as VideoContainer;
      const videoComponent = videoContainer.ScrollScrubVideoComponent;

      // Add class 'animating' to element if it is within the viewport
      videoContainer.classList.add('animating');
      videoContainer.classList.toggle('in-view', isWithinViewport);

      // Remove the animation class after we're done zooming in or out
      const delay = videoComponent.zoomDuration * 1000;
      setTimeout(() => {
        videoContainer.classList.remove('animating');
      }, delay);

      if (isWithinViewport) {
        activeScrollScrubComponent = videoComponent;
        ScrollScrubVideoComponent.handleScrollEvent();
      }
    });
  }

  static updateAllScrollScrubComponents() {
    // Get new positions of scrub video components
    allScrollScrubComponents.forEach((videoComponent) => {
      const clientRect = videoComponent.getBoundingClientRect();
      const { y, bottom } = clientRect;
      const videoComponentTopPosition = y + window.scrollY;
      const videoComponentBottomPosition = bottom - window.innerHeight + window.scrollY;

      if (videoComponent.minWidth && window.innerWidth < videoComponent.minWidth) {
        videoComponent.style.display = 'none';
        videoComponent.isHidden = true;
      } else if (videoComponent.isHidden && window.innerWidth >= videoComponent.minWidth) {
        videoComponent.style.display = 'block';
        videoComponent.isHidden = false;
        if (!observedElements.has(videoComponent)) {
          videoComponent.loadAndObserve();
        }
      }

      componentDataMap.set(videoComponent, {
        lower: videoComponentTopPosition,
        upper: videoComponentBottomPosition,
        video: videoComponent.shadowRoot!.querySelector('video')
      });
    });

  };

  static handleScrollEvent() {
    if (activeScrollScrubComponent) {
      const activeWrapperPosition = componentDataMap.get(activeScrollScrubComponent);

      if (!activeWrapperPosition) {
        return;
      }

      const { lower, upper, video } = activeWrapperPosition;

      if (video) {
        // Calculate the scroll progress within the active video wrapper
        const progress = Math.max(Math.min((window.scrollY - lower) / (upper - lower), OVERSCRUB_AVOIDANCE_FACTOR), 0);
        const seekTime = (progress * video.duration);

        // console.log(`${wrapperTopPosition} > ${window.scrollY} (${progress}) [${seekTime}] duration: ${video.duration} > ${wrapperBottomPosition}`);
        if (isFinite(seekTime) && !isNaN(video.duration)) {
          requestAnimationFrame(() => {
            video.currentTime = seekTime;
          });
        }
      }
    }
  };

  preloadVideo(): Promise<void> {
    if (this.src) {
      let blobURL: string | null = null;
      return fetch(this.src)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob()
        })
        .then((response) => {
          blobURL = URL.createObjectURL(response);
          if (this.video) {
            this.video.setAttribute("src", blobURL);
          }
          this.classList.add('video-loaded');
        })
        .catch(e => {
          console.error("Error preloading video:", e);
        });
    }
    return Promise.resolve();
  }

  render() {
    this.src = this.getAttribute('src');

    // Is there are Firefox=only src?
    let firefoxSrc = this.getAttribute('firefox-src');
    if (firefoxSrc) {
      // Is this Firefox?
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        this.src = firefoxSrc;
      }
    }


    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot!.innerHTML = `
      ${styles}
      <div class='scrub-video-container'>
          <video src='${this.src}' muted  playsinline></video>
      </div>`;

    this.videoContainer = this.shadowRoot.querySelector('.scrub-video-container') as VideoContainer;

    if (this.minWidth) {
      if (window.innerWidth >= this.minWidth) {
        this.loadAndObserve();
      } else {
        this.style.display = 'none';
        this.isHidden = true;
      }
    } else {
      this.loadAndObserve();
    }

  }

}

customElements.define("scroll-scrub-video", ScrollScrubVideoComponent);

// The following type makes it easier for other projects to use this component with TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'scroll-scrub-video': ScrollScrubVideoComponent;
  }
}