import { BaseRepository } from "./base";
import { Defaults, User } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { UserModel } from "../schemas/user.schema";
import { Model } from "mongoose";

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
        @inject(UserModel) protected userModel: Model<User>) {

        // Initialize [[BaseRepository]] 
        super(userModel, Defaults.collectionsName.users);
    }

}