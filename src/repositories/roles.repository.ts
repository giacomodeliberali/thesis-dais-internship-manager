import { BaseRepository } from "./base";
import { Defaults, IRole } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { RoleModel } from "../schemas/role.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";

/**
 * The [[Role]] repository
 */
@injectable()
export class RolesRepository extends BaseRepository<IRole> {

    /**
     * Initialize [[RolesRepository]]
     * @param roleModel The injected [[RoleSchema]] model
     */
    constructor(
        @inject(types.Models.Role) protected roleModel: Model<IRole>) {

        // Initialize [[BaseRepository]] 
        super(roleModel, Defaults.collectionsName.roles);
    }

}