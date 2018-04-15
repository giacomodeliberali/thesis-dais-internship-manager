"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The application [[User]] role types.
 * Each [[Role]] can have multiples types, so this is a Map and must be used with bitwise operations
 *
 * For more info on how to use flags check:
 *  - http://www.alanzucconi.com/2015/07/26/enum-flags-and-bitwise-operators/
 */
var RoleType;
(function (RoleType) {
    /** The student. Can see internship and create an [[InternshipProposal]] */
    RoleType[RoleType["Student"] = 0] = "Student";
    /** The professor. Must confirm its presence in an [[InternshipProposal]] */
    RoleType[RoleType["Tutor"] = 1] = "Tutor";
    /** The company. Can create an [[Internship]] */
    RoleType[RoleType["Company"] = 2] = "Company";
    /** The admin. Can approve [[Internship]] */
    RoleType[RoleType["Admin"] = 4] = "Admin";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
//# sourceMappingURL=role-type.enum.js.map