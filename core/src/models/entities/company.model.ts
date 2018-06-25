import { Address, User, BaseEntity } from "./index";
import { CompanyStatusType } from "../enums";

/** A company */
export class Company extends BaseEntity<Company>{
    /** The name */
    name: string;

    /** The legal company address */
    address: Address;

    /** The status */
    status: CompanyStatusType;

    /** The vat code (partita iva) */
    vatCode: string;

    /** The owners of this company */
    owners: Array<User>;

    /** The registration date */
    registrationDate?: Date;
}