import { BaseRepository } from "./base";
import { Defaults, Internship, InternshipStatusType, InternshipProposalStatusType } from "gdl-thesis-core/dist";
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

    /**
     * Return all the Approved internships
     */
    async getApproved() {
        return this.find({
            status: InternshipStatusType.Approved
        });
    }

    /**
     * Return all the NotApproved internships
     */
    async getNotApproved() {
        return this.find({
            status: InternshipStatusType.NotApproved
        });
    }

    /**
     * Create a new [[Internship]] initialized with the NotApproved status
     * @param item The internship to create
     */
    async create(item: Internship) {
        if (item)
            item.status = InternshipStatusType.NotApproved;
        console.log("Initialize status to NotApproved");
        return super.create(item);
    }

}