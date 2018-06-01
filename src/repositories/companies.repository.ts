import { BaseRepository } from "./base";
import { Defaults, Company, ApiResponseDto } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { CompanyModel } from "../schemas/company.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";
import { ICompany } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";

/**
 * The [[Company]] repository
 */
@injectable()
export class CompaniesRepository extends BaseRepository<ICompany, Company> {

    /**
     * Initialize [[UsersRepository]]
     * @param companyModel The injected [[CompanyModel]] model
     */
    constructor(
        @inject(types.Models.Company) protected companyModel: Model<ICompany>) {

        // Initialize [[BaseRepository]] 
        super(companyModel, Defaults.collectionsName.companies);
    }

    /**
     * Return all the companies of which the given user id is a owner
     * @param id The owner id
     */
    public getByOwnerId(id: string) {
        return this.find({
            owners: id as any
        });
    }
}