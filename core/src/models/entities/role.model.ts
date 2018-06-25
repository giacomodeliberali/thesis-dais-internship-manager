import { BaseEntity } from ".";

/** A [[User]] role */
export class Role extends BaseEntity<Role>{

    /** The name (eg. Admin,Moderator,...) */
    name: string;

    /** The [[RoleTypeEnum]] values sum */
    type: number;
}