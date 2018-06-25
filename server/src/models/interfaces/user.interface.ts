import { IBaseEntity } from "./base";
import { User } from "thesis-dais-internship-manager-core";

/**
 * A registred user
 */
export interface IUser extends IBaseEntity, User {

}