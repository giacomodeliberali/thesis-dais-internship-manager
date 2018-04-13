"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Defaults = /** @class */ (function () {
    function Defaults() {
    }
    /** The MongoDB collections name */
    Defaults.collectionsName = {
        /** The [[User]] collection */
        users: "users",
        /** The [[Role]] collection  */
        roles: "roles"
    };
    return Defaults;
}());
exports.Defaults = Defaults;
