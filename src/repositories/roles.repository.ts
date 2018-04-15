import { BaseRepository } from "./base";
import { Defaults, Role } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { RoleModel } from "../schemas/role.schema";
import { Model } from "mongoose";
import { types } from "../di-types";

/**
 * The [[Role]] repository
 */
@injectable()
export class RolesRepository extends BaseRepository<Role> {

    /**
     * Initialize [[RolesRepository]]
     * @param roleModel The injected [[RoleSchema]] model
     */
    constructor(
        @inject(types.Models.Role) protected roleModel: Model<Role>) {

        // Initialize [[BaseRepository]] 
        super(roleModel, Defaults.collectionsName.roles);
    }

}