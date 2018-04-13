import { ILogger } from "../models/interfaces";
import { LogLevel } from "../models/enums";
/**
 * A logger service
 */
export declare class LoggerService implements ILogger {
    logLevel: LogLevel;
    /**
     * Create a new [[LoggerService]]
     * @param logLevel The log level
     */
    constructor(logLevel: LogLevel);
    /**
     * Log a message
     * @param params The parameters to log
     */
    log(...params: any[]): void;
    /**
     * Log an exception
     * @param params The parameters to log
     */
    error(...params: any[]): void;
}
