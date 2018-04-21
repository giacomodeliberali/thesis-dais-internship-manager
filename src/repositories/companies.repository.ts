import { BaseRepository } from "./base";
import { Defaults, ICompany, Company } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { CompanyModel } from "../schemas/company.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";

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

}