import { BaseRepository } from "./base";
import { Defaults } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { RoleModel } from "../schemas/role.schema";
import { IRolesRepository } from "./base/roles.repository.interface";

/**
 * The [[Role]] repository
 */
@injectable()
export class RolesRepository extends IRolesRepository {

    /**
     * Initialize [[RolesRepository]]
     * @param roleModel The injected [[RoleSchema]] model
     */
    constructor(@inject(RoleModel) protected roleModel: any) {
        super(roleModel, "roles");
    }

}