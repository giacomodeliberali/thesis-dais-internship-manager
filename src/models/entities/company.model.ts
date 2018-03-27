import { CompanyStatusType } from "../enums";
import { BaseEntity } from "./base";
import { User } from "./index";

/** A company */
export class Company extends BaseEntity<Company> {

    /** The name */
    public name: string;

    /** The legal company address */
    public address: string;

    /** The status */
    public status: CompanyStatusType;

    /** The vat code (partita iva) */
    public vatNumber: string;

    /** The phones number */
    public phones: Array<number>;

    /** The owners of this company */
    public owners: Array<User>;

}