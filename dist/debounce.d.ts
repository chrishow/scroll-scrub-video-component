interface DebounceFunction {
    (callback: (...args: any[]) => void, frequency?: number, timer?: number | null): (...args: any[]) => void;
}
export declare const debounce: DebounceFunction;
export {};
//# sourceMappingURL=debounce.d.ts.map