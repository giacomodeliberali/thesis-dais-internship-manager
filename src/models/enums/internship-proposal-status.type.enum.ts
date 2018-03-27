/**
 * The [[InternshipProposal]] status type
 */
export enum InternshipProposalStatusType {

    /** There is a professor ([[User]]) waiting to be linked to this proposal */
    WaitingForProfessor,

    /** A professor is confirmed, waiting last [[Company]] confirmation */
    WaitingForCompany,

    /** The [[Company]] confirmed and the professor has accepted invite */
    Confirmed,

    /** The [[InternshipProposal]] is stared */
    Started,

    /** The [[InternshipProposal]] is ended */
    Ended,

    /** The [[InternshipProposal]] is canceled by the [[Company]] or the professor ([[User]]) */
    Canceled
}