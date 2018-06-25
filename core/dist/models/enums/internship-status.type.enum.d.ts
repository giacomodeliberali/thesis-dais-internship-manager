/**
 * The [[Internship]] status type
 */
export declare enum InternshipStatusType {
    /** The [[Internship]] is not approved by an admin yet */
    NotApproved = 0,
    /** The [[Internship]] has been approved by an admin and is visible for students [[User]] */
    Approved = 1,
    /** The [[Internship]] has been closed because the number of students reached its max number */
    Closed = 2,
    /** The [[Internship]] has been canceled by the company who created it */
    Canceled = 3,
    /** The [[Internship]] has been rejected by an admin */
    Rejected = 4,
}
