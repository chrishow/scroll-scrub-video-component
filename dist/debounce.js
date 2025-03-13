export const debounce = (callback, frequency = 250, timer = null) => {
    return (...args) => (clearTimeout(timer), (timer = setTimeout(function () {
        callback();
    }, frequency, ...args)));
};
//# sourceMappingURL=debounce.js.map