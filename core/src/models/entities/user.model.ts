import { Role, Address, BaseEntity } from "./index";
import { AuthType } from "../enums/auth-type.enum";

/** A portal user */
export class User extends BaseEntity<User>{
    /** The full name */
    name: string;

    /** The email (used also as username) */
    email: string;

    /** The phone numbers */
    phone?: Array<string>;

    /** The role */
    role: Role;

    /** The birth date */
    birthDate?: Date;

    /** The registration date */
    registrationDate?: Date;

    /** The residence address */
    residenceAddress?: Address;

    /** The google id, populated if authType Google */
    googleId?: string;

    /** The user encrypted password, populated if authType is local */
    password?: string;

    /** The user auth type */
    authType: AuthType;

    /** The user image */
    image?: string;
}