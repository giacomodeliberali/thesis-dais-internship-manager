import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company, Defaults } from "thesis-dais-internship-manager-core";

/**
 * The companies service
 *
 * @extends {BaseService}
 */
@injectable()
export class CompaniesService extends BaseService {

    /**
     * Return all the companies of which the given id is a owner
     *
     * @param {string} ownerId The owner identifier
     */
    getByOwnerId(ownerId: string): Promise<ApiResponseDto<Array<Company>>> {
        return this.getVerb(`${Defaults.collectionsName.companies}/getByOwnerId/${ownerId}`) as Promise<ApiResponseDto<Array<Company>>>;
    }

    /**
     * Create a new company
     *
     * @param {Company} company The new company to create
     */
    create(company: Company): Promise<ApiResponseDto<Company>> {
        return this.postVerb(Defaults.collectionsName.companies, company.clone());
    }

    /**
     * Return a company by id
     *
     * @param {string} id The company identifier
     */
    getById(id: string): Promise<ApiResponseDto<Company>> {
        return this.getVerb(`${Defaults.collectionsName.companies}/${id}`);
    }

    /**
     * Update an existing company
     *
     * @param {Company} company The company to update
     */
    update(company: Company): Promise<ApiResponseDto<Company>> {
        return this.putVerb(Defaults.collectionsName.companies, company);
    }
}