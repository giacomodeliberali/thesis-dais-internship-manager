import { BaseRepository } from "./base";
import { Defaults, IUser, User, RoleType } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { types } from "../utils/di-types";

/**
 * The [[user]] repository
 */
@injectable()
export class UsersRepository extends BaseRepository<IUser> {

    /**
     * Initialize [[UsersRepository]]
     * @param roleModel The injected [[UserSchema]] model
     */
    constructor(
        @inject(types.Models.User) protected userModel: Model<IUser>) {

        // Initialize [[BaseRepository]] 
        super(userModel, Defaults.collectionsName.users);
    }

    /**
     * Return all users with role matching al least one of the given roles
     */
    public async getByRoles(roles: RoleType | Array<RoleType>) {
        const users = await this.find();
        return users.filter(u => {
            if (u.role) {
                if (Array.isArray(roles)) {
                    for (let i = 0; i < roles.length; i++) {
                        if ((Number(u.role.type) & Number(roles[i])) === Number(roles[i]))
                            return true;

                    }
                } else {
                    if ((Number(u.role.type) & Number(roles)) === Number(roles))
                        return true;
                }
            }
            return false;
        });
    }

}