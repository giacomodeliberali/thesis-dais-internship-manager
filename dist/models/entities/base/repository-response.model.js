"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A typed response from a repository
 */
var ServiceResponse = /** @class */ (function () {
    /**
     * Creates a new service response
     * @param item The response
     */
    function ServiceResponse(item) {
        if (item)
            Object.assign(this, item);
    }
    return ServiceResponse;
}());
exports.ServiceResponse = ServiceResponse;
