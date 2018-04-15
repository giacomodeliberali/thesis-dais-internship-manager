import { BaseRepository } from "./base";
import { Defaults, User } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { types } from "../di-types";

/**
 * The [[user]] repository
 */
@injectable()
export class UsersRepository extends BaseRepository<User> {

    /**
     * Initialize [[UsersRepository]]
     * @param roleModel The injected [[UserSchema]] model
     */
    constructor(
        @inject(types.Models.User) protected userModel: Model<User>) {

        // Initialize [[BaseRepository]] 
        super(userModel, Defaults.collectionsName.users);
    }

}