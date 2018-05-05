import { BaseRepository } from "./base";
import { Defaults, User, RoleType } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { types } from "../utils/di-types";
import { UserModel } from "../schemas/user.schema";
import { IUser } from "../models/interfaces";
import { AuthType } from "gdl-thesis-core/dist/models/enums/auth-type.enum";
const bcrypt = require('bcrypt');

/**
 * The [[user]] repository
 */
@injectable()
export class UsersRepository extends BaseRepository<IUser, User> {

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
        return this
            .findOne({ email: email, authType: AuthType.Local })
            .then(user => {
                if (user && (user as any).isValidPassword(password))
                    return Promise.resolve(user);
                else
                    return Promise.reject({
                        message: "Bad login attempt",
                        code: "auth/bad-login"
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
    public async register(user: User): Promise<IUser> {

        try {

            if (!user)
                return Promise.resolve(null);
            if (!user.password || !user.email)
                return Promise.resolve(null);

            const exist = await this.findOne({ email: user.email, authType: AuthType.Local });
            if (exist) {
                return Promise.reject({
                    message: "Email already taken",
                    code: "auth/email-taken"
                });
            }

            user.registrationDate = new Date();

            return this.update(user);

        } catch (ex) {
            return Promise.reject({
                message: "Error creating a new user",
                error: ex
            });
        }
    }

    /**
     * Update the own user profile
     * @param user The user to update
     */
    public async updateOwn(user: User): Promise<IUser> {
        return this.model.find({ _id: user.id })
            .update({
                $set: {
                    phone: user.phone
                }
            }).then(u => {
                return this.findOne({ _id: user.id });
            }).catch(ex => {
                return Promise.reject(ex);
            });
    }

}