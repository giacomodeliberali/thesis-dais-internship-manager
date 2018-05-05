import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship } from "gdl-thesis-core/dist";

@injectable()
export class InternshipsService extends BaseService {

    getAll(): Promise<ApiResponseDto<Array<Internship>>> {
        return this.get('internships') as Promise<ApiResponseDto<Array<Internship>>>;
    }

    create(internship: Internship): Promise<ApiResponseDto<Internship>> {
        return this.post('internships', internship) as Promise<ApiResponseDto<Internship>>;
    }

    update(internship: Internship): Promise<ApiResponseDto<Internship>> {
        return this.put('internships', internship) as Promise<ApiResponseDto<Internship>>;
    }

    getById(id: string): Promise<ApiResponseDto<Internship>> {
        return this.get(`internships/${id}`);
    }

    getByCompanyOwnerId(id: string): Promise<ApiResponseDto<Array<Internship>>> {
        return this.get(`internships/getByCompanyOwnerId/${id}`);
    }
}