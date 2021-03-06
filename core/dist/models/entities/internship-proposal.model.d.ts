import { Internship, User, BaseEntity } from "./index";
import { InternshipProposalStatusType } from "../enums";
import { Attendance } from "./attendance.model";
/** In internship proposal */
export declare class InternshipProposal extends BaseEntity<InternshipProposal> {
    /** The referral internship */
    internship: Internship;
    /** The student who requested this proposal  */
    student: User;
    /** The tutor for this stage */
    professor: User;
    /** The proposal creation date */
    creationDate: Date;
    /** The end/close/cancel date */
    endDate: Date;
    /** The start date */
    startDate: Date;
    /** The proposal status */
    status: InternshipProposalStatusType;
    /** The completed attendances */
    attendances: Array<Attendance>;
}
