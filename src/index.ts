interface TimeLoopOptions {
  /** Symbol标识的名称 */
  symbolName?: string;

  /** 是否循环。如果设置为 false，表示 callback 只会运行一次 */
  isLoop?: boolean;
}

const idMap = new Map<symbol, number>();

/** 最小间隔时间 (ms) */
const MIN_MS = 4;

function stopAnimationAndDeleteId(timeoutId: symbol) {
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
function timeLoop(
  callback: () => void,
  delay = 0,
  { symbolName = "timeLoop", isLoop = false }: TimeLoopOptions = {}
) {
  let start = -1;
  let i = 1;

  let symbolId = Symbol(symbolName);
  let rafId = 0;

  const step = () => {
    rafId = requestAnimationFrame((timeStamp) => {
      if (start === -1) {
        start = timeStamp;
      }

      const elapsed = timeStamp - start;

      /** 每次运行一次函数，距离第一次运行时的总的时间间隔 */
      const ALL_DELAY_MS = delay * i;

      if (
        Math.abs(elapsed - ALL_DELAY_MS) < MIN_MS ||
        elapsed >= ALL_DELAY_MS
      ) {
        i++;
        callback();
      }

      if (isLoop === false && i > 1) {
        return;
      } else {
        step();
      }
    });

    idMap.set(symbolId, rafId);
  };

  step();

  return symbolId;
}

const RAF = {
  setTimeout: function (callback: () => void, delay = 0) {
    const timeoutId = timeLoop(callback, delay, {
      symbolName: "timeoutId",
    });

    return timeoutId;
  },

  clearTimeout: function (timeoutId: symbol) {
    stopAnimationAndDeleteId(timeoutId);
  },

  setInterval: function (callback: () => void, delay = 100) {
    const intervalId = timeLoop(callback, delay, {
      symbolName: "intervalId",
      isLoop: true,
    });

    return intervalId;
  },

  clearInterval: function (intervalId: symbol) {
    stopAnimationAndDeleteId(intervalId);
  },
};

export { RAF };
