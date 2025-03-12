declare class ScrollScrubVideoComponent extends HTMLElement {
    minWidth: number;
    isHidden: boolean;
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