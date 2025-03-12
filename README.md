# Web Component Starter

Boilerplate project for building a web component that is fully equipped with TypeScript and is ready to be published to NPM.

This is a framework agnostic component, however when using it in React - we recommended that you wrap it using a dedicated library to overcome some web component incompatibilities (read [docs](https://reactjs.org/docs/web-components.html) and [tests](https://custom-elements-everywhere.com/)). See [example](https://github.com/lit/lit/tree/main/packages/labs/react).

## :rocket: Setup commands

```npm install```

Installs node dependencies.

```npm run build```

Builds the component.

```npm run build:watch```

Used to automatically rebuild the component as soon as any changes are made to the code.

```npm run serve```

Serves the component locally (from _index.html_).


## :construction_worker: Other commands

```npm run build:bundle```

Bundles the component into a single file (to _dist/scroll-scrub-video-fast.bundle.js_). This is great for serving the component via a CDN, such as [UPKG](https://unpkg.com/) ([example](https://codesandbox.io/s/scroll-scrub-video-cdn-3ouokv?file=/index.html)).

```npm run analyze```

Builds a [custom elements manifest](https://github.com/webcomponents/custom-elements-manifest) (_custom-elements.json_) which can be used by assistive tools to benefit the custom element development experience.

## :books: More information

You can find out more information on how to build vanilla web components in [Mozilla docs](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and [web dev](https://web.dev/custom-elements-v1/). Additionally, a great list of vanilla examples can be found [here](https://github.com/mdn/web-components-examples).

## :yellow_heart: Contributions

Open source is built by the community for the community. All contributions to this project are welcome!
<br> Additionally, if you have any suggestions for enhancements, ideas on how to take the project further or have discovered a bug, do not hesitate to create a new issue ticket and we will look into it as soon as possible!