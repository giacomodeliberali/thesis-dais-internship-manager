import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto } from "gdl-thesis-core/dist";

@injectable()
export class UsersService extends BaseService {

    updateOwn(user: User) {
        return this.putVerb('users/own', user) as Promise<ApiResponseDto<{
            user: User,
            token: string
        }>>;
    }
}