/**
 * The [[InternshipProposal]] status type
 */
export declare enum InternshipProposalStatusType {
    /** There is a professor ([[User]]) waiting to be linked to this proposal */
    WaitingForProfessor = 0,
    /** A professor is confirmed, waiting last [[Company]] confirmation */
    WaitingForCompany = 1,
    /** The [[Company]] confirmed and the professor has accepted invite */
    Confirmed = 2,
    /** The [[InternshipProposal]] is stared */
    Started = 3,
    /** The [[InternshipProposal]] is ended */
    Ended = 4,
    /** The [[InternshipProposal]] is canceled by the [[Company]] or the professor ([[User]]) */
    Canceled = 5,
}
