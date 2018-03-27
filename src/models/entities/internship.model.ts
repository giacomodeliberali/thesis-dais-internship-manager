import { BaseEntity } from "./base";
import { Company } from "./company.model";
import { User } from "./user.model";
import { InternshipStatusType } from "../enums";

/**
 * A internship created by a [[Company]]
 */
export class Internship extends BaseEntity<Internship> {

    /** The company who offered this stage */
    public company: Company;

    /** The start date */
    public startDate: Date;

    /** The end date */
    public endDate: Date;

    /** The number of total hours */
    public totalHours: number;

    /** The location address */
    public address: string;

    /** The description */
    public description: string;

    /** The title */
    public title: string;

    /** A list of related tags */
    public tags: Array<string>;

    /** The number of students accepted for this stage */
    public studentsNumber: number;

    /** The status */
    public status: InternshipStatusType;

    /** The reason why this [[Internship]] has been rejected by an admin */
    public rejectReason?: string;

}