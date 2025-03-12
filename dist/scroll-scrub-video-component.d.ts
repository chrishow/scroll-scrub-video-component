interface ComponentData {
    lower: number;
    upper: number;
    video: HTMLVideoElement | null;
}
declare class ScrollScrubVideoComponent extends HTMLElement {
    static observer: IntersectionObserver;
    static activeVideoComponent: ScrollScrubVideoComponent | null;
    static scrubVideos: Set<ScrollScrubVideoComponent>;
    static observedElements: Set<ScrollScrubVideoComponent>;
    static OVERSCRUB_AVOIDANCE_FACTOR: number;
    minWidth: number;
    isHidden: boolean;
    componentData: ComponentData;
    zoomDuration: number;
    video: HTMLVideoElement | null;
    src: string | null;
    constructor();
    connectedCallback(): void;
    loadAndObserve(): void;
    disconnectedCallback(): void;
    static maybeDoStaticInitialisation(): void;
    static intersectionObserverCallback(entries: IntersectionObserverEntry[], _: IntersectionObserver): void;
    static updateScrubVideos(): void;
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