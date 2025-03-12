const i=new WeakMap;let t,n,e=!1;const o=new Set,s=new Set;class r extends HTMLElement{constructor(){super(),r.maybeDoStaticInitialisation(),this.isHidden=!1,this.zoomDuration=parseFloat(getComputedStyle(this).getPropertyValue("--zoom-duration")||"0.2s"),this.video=null,this.src=null,this.isInited=!1,this.videoContainer=null}connectedCallback(){this.attachShadow({mode:"open"}),this.render(),o.add(this),this.isInited=!0}loadAndObserve(){this.video=this.shadowRoot.querySelector("video"),this.video&&this.preloadVideo().then((()=>{this.videoContainer&&(this.videoContainer.ScrollScrubVideoComponent=this,t.observe(this.videoContainer),s.add(this),r.updateAllScrollScrubComponents())}))}disconnectedCallback(){this.videoContainer&&t.unobserve(this.videoContainer),s.delete(this),o.delete(this),r.updateAllScrollScrubComponents()}attributeChangedCallback(i,n,e){this.isInited&&n!==e&&(this.classList.remove("video-loaded"),t.unobserve(this.videoContainer),this.render(),r.updateAllScrollScrubComponents())}get minWidth(){var i;return parseInt(null!==(i=this.getAttribute("min-width"))&&void 0!==i?i:"0",10)}static get observedAttributes(){return["src","firefox-src","min-width"]}static maybeDoStaticInitialisation(){e||(t=new IntersectionObserver(r.intersectionObserverCallback,{threshold:1}),document.addEventListener("scroll",r.handleScrollEvent),window.addEventListener("resize",r.updateAllScrollScrubComponents),e=!0)}static intersectionObserverCallback(i,t){i.forEach((i=>{const t=1===i.intersectionRatio,e=i.target,o=e.ScrollScrubVideoComponent;e.classList.add("animating"),e.classList.toggle("in-view",t);const s=1e3*o.zoomDuration;setTimeout((()=>{e.classList.remove("animating")}),s),t&&(n=o,r.handleScrollEvent())}))}static updateAllScrollScrubComponents(){o.forEach((t=>{const n=t.getBoundingClientRect(),{y:e,bottom:o}=n,r=e+window.scrollY,a=o-window.innerHeight+window.scrollY;t.minWidth&&window.innerWidth<t.minWidth?(t.style.display="none",t.isHidden=!0):t.isHidden&&window.innerWidth>=t.minWidth&&(t.style.display="block",t.isHidden=!1,s.has(t)||t.loadAndObserve()),i.set(t,{lower:r,upper:a,video:t.shadowRoot.querySelector("video")})}))}static handleScrollEvent(){if(n){const t=i.get(n);if(!t)return;const{lower:e,upper:o,video:s}=t;if(s){const i=Math.max(Math.min((window.scrollY-e)/(o-e),.99),0)*s.duration;isFinite(i)&&!isNaN(s.duration)&&requestAnimationFrame((()=>{s.currentTime=i}))}}}preloadVideo(){if(this.src){let i=null;return fetch(this.src).then((i=>{if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);return i.blob()})).then((t=>{i=URL.createObjectURL(t),this.video&&this.video.setAttribute("src",i),this.classList.add("video-loaded")})).catch((i=>{console.error("Error preloading video:",i)}))}return Promise.resolve()}render(){this.src=this.getAttribute("src");let i=this.getAttribute("firefox-src");if(i){navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&(this.src=i)}this.shadowRoot&&(this.shadowRoot.innerHTML=`\n      \n  <style>\n      :host {\n          display: block;\n      }\n\n      :host(.video-loaded) {\n          height: calc(100vh * var(--scrub-pages, 6));\n      }\n\n      :host(.video-loaded) video {\n          opacity: 1;\n      }\n      \n      .scrub-video-container {\n          position: sticky;\n          top: 0px;\n          height: 100vh;\n          margin-left: var(--unzoomed-margin-left, 5rem);\n          margin-right: var(--unzoomed-margin-right, 5rem);                \n      }\n      \n      .scrub-video-container.animating {\n          transition: all var(--zoom-duration, 0.2s);\n      }\n\n      .scrub-video-container.animating video {\n          transition: all var(--zoom-duration, 0.2s), opacity var(--load-fade-duration, 0.2s);\n      }\n\n      .scrub-video-container.in-view {\n          margin: 0;\n      }\n\n      .scrub-video-container.in-view video {\n          top: 0;\n          height: 100%;\n      }\n\n      video {\n          position: absolute;\n          top: var(--unzoomed-margin-top, 3rem);\n          left: 0;\n          width: 100%;\n          height: calc(100% - var(--unzoomed-margin-top, 3rem) - var(--unzoomed-margin-bottom, 3rem));\n          object-fit: cover;\n          opacity: 0;\n          transition: opacity var(--load-fade-duration, 0.2s);\n      }\n  </style>\n\n      <div class='scrub-video-container'>\n          <video src='${this.src}' muted  playsinline></video>\n      </div>`,this.videoContainer=this.shadowRoot.querySelector(".scrub-video-container"),this.minWidth?window.innerWidth>=this.minWidth?this.loadAndObserve():(this.style.display="none",this.isHidden=!0):this.loadAndObserve())}}customElements.define("scroll-scrub-video",r);
