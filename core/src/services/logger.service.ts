import { ILogger } from "../models/interfaces";
import { LogLevel } from "../models/enums";

/**
 * A logger service
 */
export class LoggerService implements ILogger {

    /**
     * Create a new [[LoggerService]]
     * @param logLevel The log level
     */
    constructor(public logLevel: LogLevel) {

    }
    
    /**
     * Log a message
     * @param params The parameters to log
     */
    public log(...params) {
        if (this.logLevel == LogLevel.Verbose)
            console.log(`[LoggerService] Log`, params);
    }

    /**
     * Log an exception
     * @param params The parameters to log
     */
    public error(...params) {
        if (this.logLevel == LogLevel.Verbose)
            console.error(`[LoggerService] Error`, params);
    }

}