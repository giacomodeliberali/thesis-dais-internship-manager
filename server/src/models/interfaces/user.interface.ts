import { IBaseEntity } from "./base";
import { User } from "gdl-thesis-core/dist";

/**
 * A registred user
 */
export interface IUser extends IBaseEntity, User {

}