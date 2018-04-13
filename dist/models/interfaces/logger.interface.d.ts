/**
 * A logger service abstraction
 */
export interface ILogger {
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
