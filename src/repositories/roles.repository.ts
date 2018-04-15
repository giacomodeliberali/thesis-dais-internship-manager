import { BaseRepository } from "./base";
import { Defaults, Role } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { RoleModel } from "../schemas/role.schema";
import { Model } from "mongoose";

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
        @inject(RoleModel) protected roleModel: Model<Role>) {

        // Initialize [[BaseRepository]] 
        super(roleModel, Defaults.collectionsName.roles);
    }

}