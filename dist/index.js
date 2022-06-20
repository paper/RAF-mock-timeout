var idMap = new Map();
/** 最小间隔时间 (ms) */
var MIN_MS = 4;
function stopAnimationAndDeleteId(timeoutId) {
    cancelAnimationFrame(idMap.get(timeoutId));
    idMap.delete(timeoutId);
}
/**
 * 基本的循环函数
 * @param callback 回调函数
 * @param delay 时间间隔
 * @param {TimeLoopOptions} [options] - 可选参数
 * @returns {Symbol} symbolId
 */
function timeLoop(callback, delay, _a) {
    if (delay === void 0) { delay = 0; }
    var _b = _a === void 0 ? {} : _a, _c = _b.symbolName, symbolName = _c === void 0 ? "timeLoop" : _c, _d = _b.isLoop, isLoop = _d === void 0 ? false : _d;
    var start = -1;
    var i = 1;
    var symbolId = Symbol(symbolName);
    var rafId = 0;
    var step = function () {
        rafId = requestAnimationFrame(function (timeStamp) {
            if (start === -1) {
                start = timeStamp;
            }
            var elapsed = timeStamp - start;
            /** 每次运行一次函数，距离第一次运行时的总的时间间隔 */
            var ALL_DELAY_MS = delay * i;
            if (Math.abs(elapsed - ALL_DELAY_MS) < MIN_MS ||
                elapsed >= ALL_DELAY_MS) {
                i++;
                callback();
            }
            if (isLoop === false && i > 1) {
                return;
            }
            else {
                step();
            }
        });
        idMap.set(symbolId, rafId);
    };
    step();
    return symbolId;
}
var RAF = {
    setTimeout: function (callback, delay) {
        if (delay === void 0) { delay = 0; }
        var timeoutId = timeLoop(callback, delay, {
            symbolName: "timeoutId",
        });
        return timeoutId;
    },
    clearTimeout: function (timeoutId) {
        stopAnimationAndDeleteId(timeoutId);
    },
    setInterval: function (callback, delay) {
        if (delay === void 0) { delay = 100; }
        var intervalId = timeLoop(callback, delay, {
            symbolName: "intervalId",
            isLoop: true,
        });
        return intervalId;
    },
    clearInterval: function (intervalId) {
        stopAnimationAndDeleteId(intervalId);
    },
};

export { RAF };
