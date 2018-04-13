import { BaseRepository } from ".";
import { User } from "gdl-thesis-core/dist";

/**
 * Abstract class used as IOC container key for [[UsersRepository]]
 */
export abstract class IUsersRepository extends BaseRepository<User> {

}