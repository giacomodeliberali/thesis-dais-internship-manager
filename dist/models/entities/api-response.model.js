"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
/**
 * A generic API response
 */
class ApiResponse extends base_1.Constructor {
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
    send() {
        this.response.status(this.httpCode).send(this.extract());
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.model.js.map