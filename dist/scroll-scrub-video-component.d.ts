interface VideoContainer extends HTMLElement {
    ScrollScrubVideoComponent: ScrollScrubVideoComponent;
}
declare class ScrollScrubVideoComponent extends HTMLElement {
    isHidden: boolean;
    zoomDuration: number;
    video: HTMLVideoElement | null;
    src: string | null;
    isInited: boolean;
    videoContainer: VideoContainer | null;
    constructor();
    connectedCallback(): void;
    loadAndObserve(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null): void;
    get minWidth(): number;
    static get observedAttributes(): string[];
    static doStaticInitialisation(): void;
    static intersectionObserverCallback(entries: IntersectionObserverEntry[], _: IntersectionObserver): void;
    static updateAllScrollScrubComponents(): void;
    static handleScrollEvent(): void;
    preloadVideo(): Promise<void>;
    render(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'scroll-scrub-video': ScrollScrubVideoComponent;
    }
}
export {};
//# sourceMappingURL=scroll-scrub-video-component.d.ts.map