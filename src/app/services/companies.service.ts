import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company } from "gdl-thesis-core/dist";

@injectable()
export class CompaniesService extends BaseService {

    getByOwnerId(ownerId: string): Promise<ApiResponseDto<Array<Company>>> {
        return this.getVerb(`companies/getByOwnerId/${ownerId}`) as Promise<ApiResponseDto<Array<Company>>>;
    }

    create(company: Company) {
        return this.postVerb(`companies`, company.clone()) as Promise<ApiResponseDto<Company>>;
    }

    getById(id: string): Promise<ApiResponseDto<Company>> {
        return this.getVerb(`companies/${id}`);
    }

    update(company: Company): Promise<ApiResponseDto<Company>> {
        return this.putVerb('companies', company);
    }
}