"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The [[Company]] status type
 */
var CompanyStatusType;
(function (CompanyStatusType) {
    /** The [[Company]] is not approved by an admin yet */
    CompanyStatusType[CompanyStatusType["NotApproved"] = 0] = "NotApproved";
    /** The [[Company]] has been approved by an admin */
    CompanyStatusType[CompanyStatusType["Approved"] = 1] = "Approved";
    /** The [[Company]] has been rejected by an admin */
    CompanyStatusType[CompanyStatusType["Rejected"] = 2] = "Rejected";
})(CompanyStatusType = exports.CompanyStatusType || (exports.CompanyStatusType = {}));
//# sourceMappingURL=company-status-type.enum.js.map