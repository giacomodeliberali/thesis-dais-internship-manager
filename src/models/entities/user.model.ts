import { BaseEntity } from "./base";
import { Role } from "./index";

/**
 * A registred user
 */
export class User extends BaseEntity<User> {

    /** The full name */
    public name: string;

    /** The email (uses also as username) */
    public email: string;

    /** The phone numbers */
    public phone: Array<string>;

    /** The role */
    public role: Role;

    /** The birth date */
    public birthDate: Date;

    /** The registration date */
    public registrationDate: Date;

}