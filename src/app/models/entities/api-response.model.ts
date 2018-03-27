import { Constructor } from './base';
import { Response } from 'express';

/**
 * A generic API response
 */
export class ApiResponse<T = any> extends Constructor<ApiResponse>{

    /** The response HTTP code */
    public httpCode: number;

    /** The result data */
    public data: T;

    /** The exception, populated when isOk() === false */
    public exception: string;

    /** The response stream */
    public response: Response;

    /** Indicates if the response is valid */
    public isOk: boolean;

    /**
     * Extract the information in this response
     */
    private extract() {
        const content = Object.assign({}, this);

        // Delete the response stream
        delete content.response;

        // A replacer function used to stringify Error javascript class
        let replaceErrors = (key: string, value: any) => {
            if (value instanceof Error) {
                let error = {} as any;
                Object.getOwnPropertyNames(value).forEach((key) => {
                    error[key] = (value as any)[key];
                });
                return error;
            }
            return value;
        }

        // Stringify the exception
        if (content.exception)
            content.exception = JSON.stringify(content.exception, replaceErrors);

        // Populate the flag
        content.isOk = content.httpCode >= 200 && content.httpCode < 300;

        // Return the object
        return content;
    }

    /**
     * Send this response
     */
    public send() {
        this.response.status(this.httpCode).send(this.extract());
    }

}