import { BaseRepository } from "./base";
import { Defaults, Company } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { CompanyModel } from "../schemas/company.schema";
import { Model } from "mongoose";
import { types } from "../di-types";

/**
 * The [[Company]] repository
 */
@injectable()
export class CompaniesRepository extends BaseRepository<Company> {

    /**
     * Initialize [[UsersRepository]]
     * @param companyModel The injected [[CompanyModel]] model
     */
    constructor(
        @inject(types.Models.Company) protected companyModel: Model<Company>) {

        // Initialize [[BaseRepository]] 
        super(companyModel, Defaults.collectionsName.companies);
    }

}