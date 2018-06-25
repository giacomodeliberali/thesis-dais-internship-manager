"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A typed response from a repository
 */
var RepositoryResponse = /** @class */ (function () {
    /**
     * Create a new typed repository response
     * @param item The response
     */
    function RepositoryResponse(item) {
        if (item)
            Object.assign(this, item);
    }
    return RepositoryResponse;
}());
exports.RepositoryResponse = RepositoryResponse;
