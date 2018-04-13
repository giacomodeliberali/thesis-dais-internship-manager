import { CompanyStatusType } from "../enums";
import { IBaseEntity } from "./base";
import { IUser } from "./index";

/** A company */
export interface Company extends IBaseEntity {

    /** The name */
    name: string;

    /** The legal company address */
    address: string;

    /** The status */
    status: CompanyStatusType;

    /** The vat code (partita iva) */
    vatCode: string;

    /** The phones number */
    phones: Array<number>;

    /** The owners of this company */
    owners: Array<IUser>;

}