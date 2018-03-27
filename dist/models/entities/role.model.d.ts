import { BaseEntity } from "./base";
/**
 * A user role
 */
export declare class Role extends BaseEntity<Role> {
    /** The name (eg. Admin,Moderator,...) */
    name: string;
    /** The [[RoleTypeEnum]] values sum */
    type: number;
}
