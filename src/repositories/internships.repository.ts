import { BaseRepository } from "./base";
import { Defaults, Internship } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { InternshipModel } from "../schemas/internship.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";
import { IInternship } from "../models/interfaces";

/**
 * The [[Internship]] repository
 */
@injectable()
export class InternshipsRepository extends BaseRepository<IInternship, Internship> {

    /**
     * Initialize [[InternshipsRepository]]
     * @param internshipsModel The injected [[InternshipModel]] model
     */
    constructor(
        @inject(types.Models.InternShip) protected internshipsModel: Model<IInternship>) {

        // Initialize [[BaseRepository]] 
        super(internshipsModel, Defaults.collectionsName.internships);
    }

    /**
     * Return the list of all internships inserted by companies
     * in which owners contain the given ownerId
     * @param id The company owner id
      */
    async getByCompanyOwnerId(id: string) {
        return this.find().then(all => all.filter(i => {
            return !!i.company.owners.find(o => o.id === id);
        }));
    }

}