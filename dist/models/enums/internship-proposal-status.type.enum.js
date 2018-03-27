"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The [[InternshipProposal]] status type
 */
var InternshipProposalStatusType;
(function (InternshipProposalStatusType) {
    /** There is a professor ([[User]]) waiting to be linked to this proposal */
    InternshipProposalStatusType[InternshipProposalStatusType["WaitingForProfessor"] = 0] = "WaitingForProfessor";
    /** A professor is confirmed, waiting last [[Company]] confirmation */
    InternshipProposalStatusType[InternshipProposalStatusType["WaitingForCompany"] = 1] = "WaitingForCompany";
    /** The [[Company]] confirmed and the professor has accepted invite */
    InternshipProposalStatusType[InternshipProposalStatusType["Confirmed"] = 2] = "Confirmed";
    /** The [[InternshipProposal]] is stared */
    InternshipProposalStatusType[InternshipProposalStatusType["Started"] = 3] = "Started";
    /** The [[InternshipProposal]] is ended */
    InternshipProposalStatusType[InternshipProposalStatusType["Ended"] = 4] = "Ended";
    /** The [[InternshipProposal]] is canceled by the [[Company]] or the professor ([[User]]) */
    InternshipProposalStatusType[InternshipProposalStatusType["Canceled"] = 5] = "Canceled";
})(InternshipProposalStatusType = exports.InternshipProposalStatusType || (exports.InternshipProposalStatusType = {}));
