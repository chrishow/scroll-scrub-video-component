export const styles = `
  <style>
      :host {
          display: block;
      }

      :host(.video-loaded) {
          height: calc(100vh * var(--scrub-pages, 6));
      }

      :host(.video-loaded) video {
          opacity: 1;
      }
      
      .scrub-video-container {
          position: sticky;
          top: 0px;
          height: 100vh;
          margin-left: var(--unzoomed-margin-left, 5rem);
          margin-right: var(--unzoomed-margin-right, 5rem);                
      }
      
      .scrub-video-container.animating {
          transition: all var(--zoom-duration, 0.2s);
      }

      .scrub-video-container.animating video {
          transition: all var(--zoom-duration, 0.2s), opacity var(--load-fade-duration, 0.2s);
      }

      .scrub-video-container.in-view {
          margin: 0;
      }

      .scrub-video-container.in-view video {
          top: 0;
          height: 100%;
      }

      video {
          position: absolute;
          top: var(--unzoomed-margin-top, 3rem);
          left: 0;
          width: 100%;
          height: calc(100% - var(--unzoomed-margin-top, 3rem) - var(--unzoomed-margin-bottom, 3rem));
          object-fit: cover;
          opacity: 0;
          transition: opacity var(--load-fade-duration, 0.2s);
      }
  </style>
`;
//# sourceMappingURL=styles.js.map