const n=new WeakMap;let i,t;const o=new Set,e=new Set;class s extends HTMLElement{constructor(){var n;super(),s.maybeDoStaticInitialisation(),this.minWidth=parseInt(null!==(n=this.getAttribute("min-width"))&&void 0!==n?n:"0",10),this.isHidden=!1,this.zoomDuration=parseFloat(getComputedStyle(this).getPropertyValue("--zoom-duration")||"0.2s"),this.video=null,this.src=null}connectedCallback(){this.attachShadow({mode:"open"}),this.minWidth?window.innerWidth>=this.minWidth?this.loadAndObserve():(this.style.display="none",this.isHidden=!0):this.loadAndObserve(),o.add(this)}loadAndObserve(){this.render(),this.video=this.shadowRoot.querySelector("video"),this.video&&this.preloadVideo().then((()=>{const n=this.shadowRoot.querySelector(".scrub-video-container");n?(n.ScrollScrubVideoComponent=this,i.observe(n),e.add(this),s.updateallScrollScrubComponents()):console.warn("scrub-video-container not found in shadow DOM")}))}disconnectedCallback(){}static maybeDoStaticInitialisation(){i||(i=new IntersectionObserver(s.intersectionObserverCallback,{threshold:1}),document.addEventListener("scroll",s.handleScrollEvent),window.addEventListener("resize",s.updateallScrollScrubComponents))}static intersectionObserverCallback(n,i){n.forEach((n=>{const i=1===n.intersectionRatio,o=n.target,e=o.ScrollScrubVideoComponent;if(!e)return void console.warn("No ScrollScrubVideoComponent found for videoContainer",o);n.target.classList.add("animating"),n.target.classList.toggle("in-view",i);const r=1e3*e.zoomDuration;setTimeout((()=>{n.target.classList.remove("animating")}),r),i&&(t=e,s.handleScrollEvent())}))}static updateallScrollScrubComponents(){o.forEach((i=>{const t=i.getBoundingClientRect(),{y:o,bottom:s}=t,r=o+window.scrollY,a=s-window.innerHeight+window.scrollY;i.minWidth&&window.innerWidth<i.minWidth?(i.style.display="none",i.isHidden=!0):i.isHidden&&window.innerWidth>=i.minWidth&&(i.style.display="block",i.isHidden=!1,e.has(i)||i.loadAndObserve()),n.set(i,{lower:r,upper:a,video:i.shadowRoot.querySelector("video")})}))}static handleScrollEvent(){if(t){const i=n.get(t);if(!i)return;const{lower:o,upper:e,video:s}=i;if(s){const n=Math.max(Math.min((window.scrollY-o)/(e-o),.99),0)*s.duration;isFinite(n)&&!isNaN(s.duration)&&(s.currentTime=n)}}}preloadVideo(){return this.src?fetch(this.src).then((n=>n.blob())).then((n=>{let i=URL.createObjectURL(n);this.video&&this.video.setAttribute("src",i),this.classList.add("video-loaded")})):Promise.resolve()}render(){this.src=this.getAttribute("src");let n=this.getAttribute("firefox-src");if(n){navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&(this.src=n)}this.shadowRoot.innerHTML=`\n      \n  <style>\n      :host {\n          display: block;\n      }\n\n      :host(.video-loaded) {\n          height: calc(100vh * var(--scrub-pages, 6));\n      }\n\n      :host(.video-loaded) video {\n          opacity: 1;\n      }\n      \n      .scrub-video-container {\n          position: sticky;\n          top: 0px;\n          height: 100vh;\n          margin-left: var(--unzoomed-margin-left, 5rem);\n          margin-right: var(--unzoomed-margin-right, 5rem);                \n      }\n      \n      .scrub-video-container.animating {\n          transition: all var(--zoom-duration, 0.2s);\n      }\n\n      .scrub-video-container.animating video {\n          transition: all var(--zoom-duration, 0.2s), opacity var(--load-fade-duration, 0.2s);\n      }\n\n      .scrub-video-container.in-view {\n          margin: 0;\n      }\n\n      .scrub-video-container.in-view video {\n          top: 0;\n          height: 100%;\n      }\n\n      video {\n          position: absolute;\n          top: var(--unzoomed-margin-top, 3rem);\n          left: 0;\n          width: 100%;\n          height: calc(100% - var(--unzoomed-margin-top, 3rem) - var(--unzoomed-margin-bottom, 3rem));\n          object-fit: cover;\n          opacity: 0;\n          transition: opacity var(--load-fade-duration, 0.2s);\n      }\n  </style>\n\n      <div class='scrub-video-container'>\n          <video src='${this.src}' muted  playsinline></video>\n      </div>`}}customElements.define("scroll-scrub-video",s);
