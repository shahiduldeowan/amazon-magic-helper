/**
 * Logging utility for consistent debug/error/info output
 * Toggle with `Logger.setEnabled(true|false)` or control per level
 */
const Logger = (() => {
  let enabled = true;

  const prefix = "[AmazonLogger]";

  const log = (type, ...args) => {
    if (!enabled) return;

    const colorMap = {
      info: "color: #007BFF",
      warn: "color: #FFA500",
      error: "color: #FF3B30",
      debug: "color: #34C759",
    };

    const timestamp = new Date().toISOString();

    if (console[type]) {
      console[type](
        `%c${prefix} [${type.toUpperCase()}] ${timestamp}`,
        colorMap[type],
        ...args
      );
    } else {
      console.log(`%c${prefix} [LOG] ${timestamp}`, "color: #999", ...args);
    }
  };

  return {
    info(...args) {
      log("info", ...args);
    },

    warn(...args) {
      log("warn", ...args);
    },

    error(...args) {
      log("error", ...args);
    },

    debug(...args) {
      log("debug", ...args);
    },

    setEnabled(value) {
      enabled = value;
    },

    isEnabled() {
      return enabled;
    },

    /**
     * Shorthand to log structured error messages consistently
     * @param {string} context - Where the error occurred
     * @param {Error|any} error - Error object or message
     */
    logError(context, error) {
      this.error(
        `${context} failed:`,
        error instanceof Error ? error.message : error
      );
      if (error?.stack) {
        console.error(error.stack);
      }
    },
  };
})();

export const logInfo = Logger.info.bind(Logger);
export const logWarn = Logger.warn.bind(Logger);
export const logError = Logger.logError.bind(Logger); // preferred for errors
export const logDebug = Logger.debug.bind(Logger);
export const LoggerInstance = Logger;
