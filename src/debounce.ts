// Tiny debounce
interface DebounceFunction {
    (callback: (...args: any[]) => void, frequency?: number, timer?: number | null): (...args: any[]) => void;
}

export const debounce: DebounceFunction = (callback, frequency = 250, timer: number | null = null) => {
    return (...args: any[]) => (
        clearTimeout(timer!), (timer = setTimeout(function () {
            callback();
        }, frequency, ...args))
    );
};

