import { CompanyStatusType } from "../enums";
import { BaseEntity } from "./base";
import { User } from "./index";
/** A company */
export declare class Company extends BaseEntity<Company> {
    /** The name */
    name: string;
    /** The legal company address */
    address: string;
    /** The status */
    status: CompanyStatusType;
    /** The vat code (partita iva) */
    vatNumber: string;
    /** The phones number */
    phones: Array<number>;
    /** The owners of this company */
    owners: Array<User>;
}
