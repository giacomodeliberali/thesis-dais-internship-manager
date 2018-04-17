import { Internship, User, BaseEntity } from "./index";
import { InternshipProposalStatusType } from "../enums";

/** In internship proposal */
export class InternshipProposal extends BaseEntity<InternshipProposal>{
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