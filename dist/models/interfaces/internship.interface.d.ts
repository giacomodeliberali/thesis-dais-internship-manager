import { IBaseEntity } from "./base";
import { Company } from "./company.interface";
import { InternshipStatusType } from "../enums";
/**
 * A internship created by a [[Company]]
 */
export interface Internship extends IBaseEntity {
    /** The company who offered this stage */
    company: Company;
    /** The start date */
    startDate: Date;
    /** The end date */
    endDate: Date;
    /** The number of total hours */
    totalHours: number;
    /** The location address */
    address: string;
    /** The description */
    description: string;
    /** The title */
    title: string;
    /** A list of related tags */
    tags: Array<string>;
    /** The number of students accepted for this stage */
    studentsNumber: number;
    /** The status */
    status: InternshipStatusType;
    /** The reason why this [[Internship]] has been rejected by an admin */
    rejectReason?: string;
}
