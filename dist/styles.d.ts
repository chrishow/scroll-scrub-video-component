export declare const styles = "\n  <style>\n      :host {\n          display: block;\n      }\n\n      :host(.video-loaded) {\n          height: calc(100vh * var(--scrub-pages, 6));\n      }\n\n      :host(.video-loaded) video {\n          opacity: 1;\n      }\n      \n      .scrub-video-container {\n          position: sticky;\n          top: 0px;\n          height: 100vh;\n          margin-left: var(--unzoomed-margin-left, 5rem);\n          margin-right: var(--unzoomed-margin-right, 5rem);                \n      }\n      \n      .scrub-video-container.animating {\n          transition: all var(--zoom-duration, 0.2s);\n      }\n\n      .scrub-video-container.animating video {\n          transition: all var(--zoom-duration, 0.2s), opacity var(--load-fade-duration, 0.2s);\n      }\n\n      .scrub-video-container.in-view {\n          margin: 0;\n      }\n\n      .scrub-video-container.in-view video {\n          top: 0;\n          height: 100%;\n      }\n\n      video {\n          position: absolute;\n          top: var(--unzoomed-margin-top, 3rem);\n          left: 0;\n          width: 100%;\n          height: calc(100% - var(--unzoomed-margin-top, 3rem) - var(--unzoomed-margin-bottom, 3rem));\n          object-fit: cover;\n          opacity: 0;\n          transition: opacity var(--load-fade-duration, 0.2s);\n      }\n  </style>\n";
//# sourceMappingURL=styles.d.ts.map