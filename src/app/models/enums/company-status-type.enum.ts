/**
 * The [[Company]] status type
 */
export enum CompanyStatusType {
    
    /** The [[Company]] is not approved by an admin yet */
    NotApproved,

    /** The [[Company]] has been approved by an admin */
    Approved,

    /** The [[Company]] has been rejected by an admin */
    Rejected
}