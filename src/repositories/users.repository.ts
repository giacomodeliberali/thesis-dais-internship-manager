import { BaseRepository } from "./base";
import { Defaults, IUser, User, RoleType } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { types } from "../utils/di-types";
import { UserModel } from "../schemas/user.schema";
const bcrypt = require('bcrypt');

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

    /**
     * Return the user if the email and password are matching, null otherwise
     * @param email The user email
     * @param password The user password
     */
    public async login(email: string, password: string): Promise<IUser> {
        return this.model
            .findOne({ email: email })
            .then(user => {
                if (user && (user as any).isValidPassword(password))
                    return Promise.resolve(user);
                else
                    return Promise.reject({
                        message: "Bad login attempt"
                    });
            })
            .catch((ex: any) => {
                return Promise.reject(ex);
            });
    }

    /**
     * Create a new user
     * @param user The user to register
     */
    public register(user: IUser) {

        if (!user)
            return Promise.resolve(null);
        if (!user.password || !user.email)
            return Promise.resolve(null);

        user.registrationDate = new Date();

        return this.update(user)
            .catch(ex => {
                return Promise.reject(ex);
            });
    }

}