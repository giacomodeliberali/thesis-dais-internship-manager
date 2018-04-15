import { IBaseEntity } from "./base";
import { Role, Address } from "./index";

/**
 * A registred user
 */
export interface User extends IBaseEntity {

    /** The full name */
    name: string;

    /** The email (uses also as username) */
    email: string;

    /** The phone numbers */
    phone: Array<string>;

    /** The role */
    role: Role;

    /** The birth date */
    birthDate: Date;

    /** The registration date */
    registrationDate: Date;

    /** The residence address */
    residenceAddress: Address;

}