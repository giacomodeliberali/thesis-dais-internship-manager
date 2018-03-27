/// <reference types="express" />
import { Constructor } from './base';
import { Response } from 'express';
/**
 * A generic API response
 */
export declare class ApiResponse<T = any> extends Constructor<ApiResponse> {
    /** The response HTTP code */
    httpCode: number;
    /** The result data */
    data: T;
    /** The exception, populated when isOk() === false */
    exception: string;
    /** The response stream */
    response: Response;
    /** Indicates if the response is valid */
    isOk: boolean;
    /**
     * Extract the information in this response
     */
    private extract();
    /**
     * Send this response
     */
    send(): void;
}
