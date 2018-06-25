"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("gdl-thesis-core/dist");
/**
 * A generic rest API response. Used in Express controllers
 */
class ApiResponse extends dist_1.Constructor {
    /**
     * Extract the information in this response
     */
    extract() {
        const content = Object.assign({}, this);
        // Delete the response stream
        delete content.response;
        // A replacer function used to stringify Error javascript class
        const replaceErrors = (key, value) => {
            if (value instanceof Error) {
                const error = {};
                Object.getOwnPropertyNames(value).forEach((k) => {
                    error[k] = value[k];
                });
                return error;
            }
            return value;
        };
        // Stringify the exception: if is a function take its return value
        if (content.exception && typeof content.exception === "function") {
            try {
                content.exception = content.exception();
            }
            catch (ex) {
                // Do nothing 
            }
        }
        // Stringify the exception
        /*         if (content.exception && typeof content.exception == "object")
                    content.exception = JSON.stringify(content.exception, replaceErrors); */
        // Populate the flag
        content.isOk = content.httpCode >= 200 && content.httpCode < 300;
        // Return the object
        return content;
    }
    /**
     * Send this response
     */
    send() {
        this.response.status(this.httpCode).send(this.extract());
    }
}
exports.ApiResponse = ApiResponse;
