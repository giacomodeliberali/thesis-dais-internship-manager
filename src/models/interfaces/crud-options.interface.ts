import { RequestHandler } from "express";

/** The CRUD options */
export interface CurdOptions {

    /** The middleware to use in before all CRUD execution */
    middleware?: Array<RequestHandler>;

    /** The create/update options */
    createUpdate?: {
        /** The middleware to use before all create/update operations */
        middleware?: Array<RequestHandler>
    };

    /** The read options */
    read?: {
        /** The middleware to use before all read operations */
        middleware?: Array<RequestHandler>
    };

    /** The delete options */
    delete?: {
        /** The middleware to use before all delete operations */
        middleware?: Array<RequestHandler>
    };
}