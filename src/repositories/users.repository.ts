import { BaseRepository } from "./base";
import { Defaults } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { IUsersRepository } from "./base/users.repository.interface";
import { UserModel } from "../schemas/user.schema";

/**
 * The [[user]] repository
 */
@injectable()
export class UsersRepository extends IUsersRepository {

    /**
     * Initialize [[UsersRepository]]
     * @param roleModel The injected [[UserSchema]] model
     */
    constructor(@inject(UserModel) protected userModel: any) {
        super(userModel, Defaults.collectionsName.users);
    }

}