import { BaseRepository } from "./base";
import { User } from "../models";
import { Db } from "mongodb";
import { Defaults } from "../models/defaults.model";

export class UsersRepository extends BaseRepository<User> {

    constructor(db: Db) {
        super(db, Defaults.collectionsName.users);
    } 
    
}