"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The [[LoggerService]] log level
 */
var LogLevel;
(function (LogLevel) {
    /** Log all messages */
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    /** Log only exception */
    LogLevel[LogLevel["Exception"] = 1] = "Exception";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
