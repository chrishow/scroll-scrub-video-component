## Scroll-to-Scrub video Web Component

A zero-dependencies web component which displays videos which scrub as you scroll the page. 


### Demo:

[Demo here](https://htmlpreview.github.io/?https://raw.githubusercontent.com/chrishow/scroll-scrub-video-component/main/demo.html)

### Usage:

#### 1. Include the Web Component javascript.

Download the file <a download href='./dist/scroll-scrub-video-component.bundle.js'>`scroll-scrub-video-component.bundle.js`</a> and include it in the document head:

```html
<script src="scroll-scrub-video-component.bundle.js"></script>
```

### 2. Add components to HTML
Add HTML elements for each component, like this:

```html
<scroll-scrub-video src="./videos/my-video.mp4"></scroll-scrub-video>
```
The attribute `src` is required. This is your video source. 

You may optionally add two more attributes:
```html
<scroll-scrub-video src="./videos/my-video.mp4" firefox-src="./videos/my-special-firefox-video.mp4" min-width="650"></scroll-scrub-video>
```
`firefox-src` is the url to a specific video to be used on Firefox browsers. This is useful because videos with a 
keyframe interval of 5 are fine on Chrome, Edge and Safari, but are very janky on Firefox. So you can specify a specific
(larger) file encoded with a keyframe interval of 1 just for Firefox. 

`min-width` allows you to specify a minimum window width in pixels, below which the element won't show, nor will it load the videos. 
If the window width is later widened above the minimum, the videos will load and display automatically. You should make sure you have 
your viewport correctly setup for this to work by adding this meta tag to the header:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```


#### 3. Add CSS
To prevent a layout shift when the component initialises, you can add this to your CSS file:

```css
 scrub-video {
  display: block;
  min-height: 100vh;
}
```

### 4. Optional additional CSS variables
The following CSS variables/custom properties can be added to the CSS in step 3 if you want more control over the component. 

The default settings are shown in these examples. 
<br><br>
  
These are the margins around the component before it is zoomed full-screen. You might want to tweak these to make 
it fit in with your page margins. 

```css
--unzoomed-margin-left: 5rem;
--unzoomed-margin-right: 5rem;
--unzoomed-margin-top: 3rem;
--unzoomed-margin-bottom: 3rem;
```
<br>
How many 'pages' you have to scroll through to scrub fully through one video.

```css
--scrub-pages: 6;
```
<br>
The video is initially not shown, then faded in when it has fully loaded. This setting controls how quickly the video fades in.

```css
--load-fade-duration: 0.2s;
```
<br>

How quickly the video zooms as it goes full screen
```css
--zoom-duration: 0.2s;
```


## 📼 Encoding videos
You can use [ffmpeg](https://www.ffmpeg.org/) to encode videos suitably for the web component. 

If you don't have ffmpeg installed, you can use this in-browser version which doesn't require you to install 
anything to your computer:

https://ffmpeg.wide.video/

I recommend using these settings for the Chrome/Edge/Safari version:

```sh
ffmpeg -y \
-i input.mov \
-vf scale=1920:-1 \
-crf 25 \
-g 5 \
-movflags faststart \
-vcodec libx264 \
-pix_fmt yuv420p \
-an \
-preset 'slow' \
output.mp4
```
In this example:

`input.mov` is the input file (this can be .mov, .mp4, .mkv, .webm etc)  
`-crf 25` is the compression setting, somewhere between 20 (small file, more compressed) and 30 (large file, very high quality) should work well.   
`-g 5` the 'max keyframe interval'  
`output.mp4` is your output file name.  

For Firefox, I would change this to:
```sh
ffmpeg -y \
-i input.mov \
-vf scale=1920:-1 \
-crf 25 \
-g 1 \
-movflags faststart \
-vcodec libx264 \
-pix_fmt yuv420p \
-an \
-preset 'slow' \
firefox-output.mp4
```


## 🚀 Development scripts

```npm install```

Installs node dependencies.

```npm run build```

Builds the component.

```npm run build:watch```

Used to automatically rebuild the component as soon as any changes are made to the code.

```npm run serve```

Serves the component locally (from _index.html_).


## 👷‍♀️ Other commands

```npm run build:bundle```

Bundles the component into a single file (to _dist/scroll-scrub-video-component.bundle.js_).


```npm run analyze```

Builds a [custom elements manifest](https://github.com/webcomponents/custom-elements-manifest) (_custom-elements.json_) which can be used by assistive tools to benefit the custom element development experience.

