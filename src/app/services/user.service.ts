import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Defaults } from "gdl-thesis-core/dist";
import { Observable } from 'rxjs/Observable';
/**
 * The users service
 *
 * @extends {BaseService}
 */
@injectable()
export class UsersService extends BaseService {

    /**
     * Update the current logged in user information
     *
     * @param {User} user The user to update
     */
    updateOwn(user: User) {
        return this.putVerb(`${Defaults.collectionsName.users}/own`, user) as Promise<ApiResponseDto<{
            user: User,
            token: string
        }>>;
    }

    /**
     * Return all professors matching the given string
     *
     * @param {string} search The search string
     */
    lookupProfessors(search: string): Observable<ApiResponseDto<Array<User>>> {
        return this.postVerbObservable(`${Defaults.collectionsName.users}/professors/lookup`, {
            search
        });
    }
}