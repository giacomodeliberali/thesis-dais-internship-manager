import { BaseRepository } from "./base";
import { Defaults, Internship } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { InternshipModel } from "../schemas/internship.schema";
import { Model } from "mongoose";
import { types } from "../di-types";

/**
 * The [[Internship]] repository
 */
@injectable()
export class InternshipsRepository extends BaseRepository<Internship> {

    /**
     * Initialize [[InternshipsRepository]]
     * @param internshipsModel The injected [[InternshipModel]] model
     */
    constructor(
        @inject(types.Models.InternShip) protected internshipsModel: Model<Internship>) {

        // Initialize [[BaseRepository]] 
        super(internshipsModel, Defaults.collectionsName.internships);
    }

}