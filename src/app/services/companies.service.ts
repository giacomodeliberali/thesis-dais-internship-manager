import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company } from "gdl-thesis-core/dist";

@injectable()
export class CompaniesService extends BaseService {

    getByOwnerId(ownerId: string): Promise<ApiResponseDto<Array<Company>>> {
        return this.get(`companies/getByOwnerId/${ownerId}`) as Promise<ApiResponseDto<Array<Company>>>;
    }

    create(company: Company) {
        return this.post(`companies`, company.clone()) as Promise<ApiResponseDto<Company>>;
    }

    getById(id: string): Promise<ApiResponseDto<Company>> {
        return this.get(`companies/${id}`);
    }

    update(company: Company): Promise<ApiResponseDto<Company>> {
        return this.put('companies', company);
    }
}