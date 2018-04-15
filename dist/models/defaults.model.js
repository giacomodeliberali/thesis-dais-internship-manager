"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Defaults = /** @class */ (function () {
    function Defaults() {
    }
    /** The MongoDB collections name */
    Defaults.collectionsName = {
        /** The [[User]] collection */
        users: "users",
        /** The [[Role]] collect
         * ion  */
        roles: "roles",
        /** The [[Company]] collection  */
        companies: "companies",
        /** The [[Internship]] collection  */
        internships: "internships",
        /** The [[InternshipProposal]] collection  */
        internshipProposals: "internshipProposals"
    };
    return Defaults;
}());
exports.Defaults = Defaults;
