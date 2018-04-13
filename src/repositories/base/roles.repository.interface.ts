import { BaseRepository } from ".";
import { Role } from "gdl-thesis-core/dist";

/**
 * Abstract class used as IOC container key for [[RolesRepository]]
 */
export abstract class IRolesRepository extends BaseRepository<Role> {

}