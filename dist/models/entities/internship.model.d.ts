import { Company, Address, BaseEntity } from "./index";
import { InternshipStatusType } from "../enums";
/** A internship proposed by a [[Company]] */
export declare class Internship extends BaseEntity<Internship> {
    /** The company who offered this stage */
    company: Company;
    /** The start date */
    startDate: Date;
    /** The end date */
    endDate: Date;
    /** The number of total hours */
    totalHours: number;
    /** The location address */
    address?: Address;
    /** The description */
    description: string;
    /** The title */
    title: string;
    /** A list of related tags */
    tags?: Array<string>;
    /** The number of students accepted for this stage */
    studentsNumber: number;
    /** The status */
    status: InternshipStatusType;
    /** The reason why this [[Internship]] has been rejected by an admin */
    rejectReason?: string;
}
