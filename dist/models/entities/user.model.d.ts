import { BaseEntity } from "./base";
import { Role } from "./index";
/**
 * A registred user
 */
export declare class User extends BaseEntity<User> {
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
}
