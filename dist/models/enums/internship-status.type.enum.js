"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The [[Internship]] status type
 */
var InternshipStatusType;
(function (InternshipStatusType) {
    /** The [[Internship]] is not approved by an admin yet */
    InternshipStatusType[InternshipStatusType["NotApproved"] = 0] = "NotApproved";
    /** The [[Internship]] has been approved by an admin and is visible for students [[User]] */
    InternshipStatusType[InternshipStatusType["Approved"] = 1] = "Approved";
    /** The [[Internship]] has been closed because the number of students reached its max number */
    InternshipStatusType[InternshipStatusType["Closed"] = 2] = "Closed";
    /** The [[Internship]] has been canceled by the company who created it */
    InternshipStatusType[InternshipStatusType["Canceled"] = 3] = "Canceled";
    /** The [[Internship]] has been rejected by an admin */
    InternshipStatusType[InternshipStatusType["Rejected"] = 4] = "Rejected";
})(InternshipStatusType = exports.InternshipStatusType || (exports.InternshipStatusType = {}));
//# sourceMappingURL=internship-status.type.enum.js.map