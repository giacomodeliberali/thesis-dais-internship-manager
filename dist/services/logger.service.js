"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../models/enums");
/**
 * A logger service
 */
var LoggerService = /** @class */ (function () {
    /**
     * Create a new [[LoggerService]]
     * @param logLevel The log level
     */
    function LoggerService(logLevel) {
        this.logLevel = logLevel;
    }
    /**
     * Log a message
     * @param params The parameters to log
     */
    LoggerService.prototype.log = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (this.logLevel == enums_1.LogLevel.Verbose)
            console.log("[LoggerService] Log", params);
    };
    /**
     * Log an exception
     * @param params The parameters to log
     */
    LoggerService.prototype.error = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (this.logLevel == enums_1.LogLevel.Verbose)
            console.error("[LoggerService] Error", params);
    };
    return LoggerService;
}());
exports.LoggerService = LoggerService;
