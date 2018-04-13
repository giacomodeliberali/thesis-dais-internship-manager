import { IBaseEntity } from "./base";
import { Internship, User } from "./index";
import { InternshipProposalStatusType } from "../enums";
/**
 * A [[Internship]] proposed by a student [[IUser]]
 */
export interface InternshipProposal extends IBaseEntity {
    /** The referral internship */
    internship: Internship;
    /** The student who requested this proposal  */
    student: User;
    /** The tutor for this stage */
    professor: User;
    /** The proposal creation date */
    creationDate: Date;
    /** The proposal status */
    status: InternshipProposalStatusType;
}
