"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
/**
 * A generic rest API response. Used in Express controllers
 */
var ApiResponse = /** @class */ (function (_super) {
    __extends(ApiResponse, _super);
    function ApiResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Extract the information in this response
     */
    ApiResponse.prototype.extract = function () {
        var content = Object.assign({}, this);
        // Delete the response stream
        delete content.response;
        // A replacer function used to stringify Error javascript class
        var replaceErrors = function (key, value) {
            if (value instanceof Error) {
                var error_1 = {};
                Object.getOwnPropertyNames(value).forEach(function (k) {
                    error_1[k] = value[k];
                });
                return error_1;
            }
            return value;
        };
        // Stringify the exception: if is a function take its return value
        if (content.exception && typeof content.exception == "function") {
            try {
                content.exception = content.exception();
            }
            catch (ex) {
                // Do nothing 
            }
        }
        // Stringify the exception
        if (content.exception && typeof content.exception == "object")
            content.exception = JSON.stringify(content.exception, replaceErrors);
        // Populate the flag
        content.isOk = content.httpCode >= 200 && content.httpCode < 300;
        // Return the object
        return content;
    };
    /**
     * Send this response
     */
    ApiResponse.prototype.send = function () {
        this.response.status(this.httpCode).send(this.extract());
    };
    return ApiResponse;
}(base_1.Constructor));
exports.ApiResponse = ApiResponse;
