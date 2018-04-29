import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company } from "gdl-thesis-core/dist";

@injectable()
export class CompaniesService extends BaseService {

    getByOwnerId(ownerId: string): Promise<ApiResponseDto<Array<Company>>> {
        return this.get(`companies/getByOwnerId/${ownerId}`) as Promise<ApiResponseDto<Array<Company>>>;
    }
}