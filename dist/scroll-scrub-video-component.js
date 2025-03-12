"use strict";
import { styles } from './styles';
// Static class members
const componentDataMap = new WeakMap();
let observer;
// The active component, if there is one
let activeScrollScrubComponent;
const allScrollScrubComponents = new Set();
const observedElements = new Set();
const OVERSCRUB_AVOIDANCE_FACTOR = 0.99;
class ScrollScrubVideoComponent extends HTMLElement {
    constructor() {
        var _a;
        super();
        ScrollScrubVideoComponent.maybeDoStaticInitialisation();
        // Initialise instance members
        this.minWidth = parseInt((_a = this.getAttribute('min-width')) !== null && _a !== void 0 ? _a : '0', 10);
        this.isHidden = false;
        this.zoomDuration = parseFloat(getComputedStyle(this).getPropertyValue('--zoom-duration') || '0.2s');
        this.video = null;
        this.src = null;
    }
    connectedCallback() {
        this.attachShadow({ mode: "open" });
        if (this.minWidth) {
            if (window.innerWidth >= this.minWidth) {
                this.loadAndObserve();
            }
            else {
                this.style.display = 'none';
                this.isHidden = true;
            }
        }
        else {
            this.loadAndObserve();
        }
        allScrollScrubComponents.add(this);
    }
    loadAndObserve() {
        this.render();
        // Get the video element
        this.video = this.shadowRoot.querySelector("video");
        if (!this.video) {
            return;
        }
        // Preload the video
        this.preloadVideo().then(() => {
            // Setup this scrub-video
            const videoContainer = this.shadowRoot.querySelector('.scrub-video-container');
            if (videoContainer) {
                videoContainer.ScrollScrubVideoComponent = this;
                observer.observe(videoContainer);
                observedElements.add(this);
                // Update the positions of all scrub-videos
                ScrollScrubVideoComponent.updateallScrollScrubComponents();
            }
            else {
                console.warn("scrub-video-container not found in shadow DOM");
            }
        });
    }
    disconnectedCallback() {
        // If you were going to remove elements, you should update the
        // ScrollScrubVideoComponent.allScrollScrubComponents set
        // We're not going to do that here, that's left as an exercise
    }
    static maybeDoStaticInitialisation() {
        if (!observer) {
            observer = new IntersectionObserver(ScrollScrubVideoComponent.intersectionObserverCallback, { threshold: 1 });
            document.addEventListener("scroll", ScrollScrubVideoComponent.handleScrollEvent);
            window.addEventListener("resize", ScrollScrubVideoComponent.updateallScrollScrubComponents);
        }
    }
    static intersectionObserverCallback(entries, _) {
        entries.forEach(entry => {
            const isWithinViewport = entry.intersectionRatio === 1;
            const videoContainer = entry.target;
            const videoComponent = videoContainer.ScrollScrubVideoComponent;
            if (!videoComponent) {
                console.warn("No ScrollScrubVideoComponent found for videoContainer", videoContainer);
                return;
            }
            // Add class 'animating' to element if it is within the viewport
            entry.target.classList.add('animating');
            entry.target.classList.toggle('in-view', isWithinViewport);
            // Remove the animation class after we're done zooming in or out
            const delay = videoComponent.zoomDuration * 1000;
            setTimeout(() => {
                entry.target.classList.remove('animating');
            }, delay);
            if (isWithinViewport) {
                activeScrollScrubComponent = videoComponent;
                ScrollScrubVideoComponent.handleScrollEvent();
            }
        });
    }
    static updateallScrollScrubComponents() {
        // Get new positions of scrub video components
        allScrollScrubComponents.forEach((videoComponent) => {
            const clientRect = videoComponent.getBoundingClientRect();
            const { y, bottom } = clientRect;
            const videoComponentTopPosition = y + window.scrollY;
            const videoComponentBottomPosition = bottom - window.innerHeight + window.scrollY;
            if (videoComponent.minWidth && window.innerWidth < videoComponent.minWidth) {
                videoComponent.style.display = 'none';
                videoComponent.isHidden = true;
            }
            else if (videoComponent.isHidden && window.innerWidth >= videoComponent.minWidth) {
                videoComponent.style.display = 'block';
                videoComponent.isHidden = false;
                if (!observedElements.has(videoComponent)) {
                    videoComponent.loadAndObserve();
                }
            }
            componentDataMap.set(videoComponent, {
                lower: videoComponentTopPosition,
                upper: videoComponentBottomPosition,
                video: videoComponent.shadowRoot.querySelector('video')
            });
        });
    }
    ;
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
                    video.currentTime = seekTime;
                }
            }
        }
    }
    ;
    preloadVideo() {
        if (this.src) {
            return fetch(this.src)
                .then((response) => {
                return response.blob();
            })
                .then((response) => {
                let blobURL = URL.createObjectURL(response);
                if (this.video) {
                    this.video.setAttribute("src", blobURL);
                }
                this.classList.add('video-loaded');
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
        this.shadowRoot.innerHTML = `
      ${styles}
      <div class='scrub-video-container'>
          <video src='${this.src}' muted  playsinline></video>
      </div>`;
    }
}
customElements.define("scroll-scrub-video", ScrollScrubVideoComponent);
//# sourceMappingURL=scroll-scrub-video-component.js.map