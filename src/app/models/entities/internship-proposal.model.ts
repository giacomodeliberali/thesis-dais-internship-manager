import { BaseEntity } from "./base";
import { Internship, User } from "./index";
import { InternshipProposalStatusType } from "../enums";

/**
 * A [[Internship]] proposed by a student [[User]]
 */
export class InternshipProposal extends BaseEntity<InternshipProposal> {

    /** The referral internship */
    public internship: Internship;

    /** The student who requested this proposal  */
    public student: User;

    /** The tutor for this stage */
    public professor: User;

    /** The proposal creation date */
    public creationDate: Date;

    /** The proposal status */
    public status: InternshipProposalStatusType;

}