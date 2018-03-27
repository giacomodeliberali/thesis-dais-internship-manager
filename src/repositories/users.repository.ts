import { BaseRepository } from "./base";
import { User, Defaults } from "gdl-thesis-core/dist";
import { Db } from "mongodb";

export class UsersRepository extends BaseRepository<User> {

    constructor(db: Db) {
        super(db, Defaults.collectionsName.users);
    }

}