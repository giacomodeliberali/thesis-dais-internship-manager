"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A typed response from a repository
 */
class ServiceResponse {
    /**
     * Creates a new service response
     * @param item The response
     */
    constructor(item) {
        if (item)
            Object.assign(this, item);
    }
}
exports.ServiceResponse = ServiceResponse;
//# sourceMappingURL=repository-response.model.js.map