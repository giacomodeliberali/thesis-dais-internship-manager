import { IBaseEntity } from "./base";
/**
 * A user role
 */
export interface Role extends IBaseEntity {
    /** The name (eg. Admin,Moderator,...) */
    name: string;
    /** The [[RoleTypeEnum]] values sum */
    type: number;
}
