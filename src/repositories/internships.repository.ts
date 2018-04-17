import { BaseRepository } from "./base";
import { Defaults, IInternship } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { InternshipModel } from "../schemas/internship.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";

/**
 * The [[Internship]] repository
 */
@injectable()
export class InternshipsRepository extends BaseRepository<IInternship> {

    /**
     * Initialize [[InternshipsRepository]]
     * @param internshipsModel The injected [[InternshipModel]] model
     */
    constructor(
        @inject(types.Models.InternShip) protected internshipsModel: Model<IInternship>) {

        // Initialize [[BaseRepository]] 
        super(internshipsModel, Defaults.collectionsName.internships);
    }

}