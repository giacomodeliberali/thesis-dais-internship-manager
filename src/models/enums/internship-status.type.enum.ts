/**
 * The [[Internship]] status type
 */
export enum InternshipStatusType {

    /** The [[Internship]] is not approved by an admin yet */
    NotApproved,

    /** The [[Internship]] has been approved by an admin and is visible for students [[User]] */
    Approved,

    /** The [[Internship]] has been closed because the number of students reached its max number */
    Closed,

    /** The [[Internship]] has been canceled by the company who created it */
    Canceled,

    /** The [[Internship]] has been rejected by an admin */
    Rejected
}