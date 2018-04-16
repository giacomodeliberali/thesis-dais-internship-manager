import { CompanyStatusType } from "../enums";
import { IBaseEntity } from "./base";
import { User, Address } from "./index";
/** A company */
export interface Company extends IBaseEntity {
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
    registrationDate: Date;
}
