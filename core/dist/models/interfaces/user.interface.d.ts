import { IBaseEntity } from "./base";
import { User } from "../index";
/**
 * A registred user
 */
export interface IUser extends IBaseEntity, User {
}
