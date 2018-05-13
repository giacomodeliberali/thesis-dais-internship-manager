import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto } from "gdl-thesis-core/dist";
import { Observable } from 'rxjs/Observable';

@injectable()
export class UsersService extends BaseService {

    updateOwn(user: User) {
        return this.putVerb('users/own', user) as Promise<ApiResponseDto<{
            user: User,
            token: string
        }>>;
    }

    lookupProfessors(search: string): Observable<ApiResponseDto<Array<User>>> {
        return this.postVerbObservable('users/professors/lookup', {
            search
        });
    }
}