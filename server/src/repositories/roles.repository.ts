import { BaseRepository } from "./base";
import { Defaults, RoleType, Role } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { RoleModel } from "../schemas/role.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";
import { IRole } from "../models/interfaces";

/**
 * The [[Role]] repository
 */
@injectable()
export class RolesRepository extends BaseRepository<IRole, Role> {

    /**
     * Initialize [[RolesRepository]]
     * @param roleModel The injected [[RoleSchema]] model
     */
    constructor(
        @inject(types.Models.Role) protected roleModel: Model<IRole>) {

        // Initialize [[BaseRepository]] 
        super(roleModel, Defaults.collectionsName.roles);
    }

    /**
     * Gets or create a role. Reject with an error if the operation fails
     * @param type The role type
     * @param name The role name
     */
    public async getOrCreateOne(type: number | RoleType, name: string) {

        let role = await this.findOne({ type: type });

        if (role)
            return role;

        console.log(`[RolesRepository] getOrCreateOne => Cannot find a valid role entry with type '${type}', creating a new one...`);

        try {
            role = await this.update({
                type: type,
                name: name
            });

            return role;
        } catch (ex) {
            return Promise.reject({
                message: "Cannot get or create a valid role entry for 'Company'",
                error: ex
            });
        }
    }

}