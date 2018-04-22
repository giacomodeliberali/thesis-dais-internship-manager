/**
 * A generic rest API response returned from the back end
 */
export interface ApiResponseDto<T = any> {

    /** The response HTTP code */
    httpCode: number;

    /** The result data */
    data?: T;

    /** The exception, populated when isOk === false */
    exception?: any;    

    /** Indicates if the response is valid */
    isOk: boolean;
}