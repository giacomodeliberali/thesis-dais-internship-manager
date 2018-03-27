import { BaseEntity } from "./base";

/**
 * A user role
 */
export class Role extends BaseEntity<Role> {

    /** The name (eg. Admin,Moderator,...) */
    public name: string;

    /** The [[RoleTypeEnum]] values sum */
    public type: number;

}