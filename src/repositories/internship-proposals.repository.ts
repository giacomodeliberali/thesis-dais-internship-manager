import { BaseRepository } from "./base";
import { Defaults, InternshipProposal } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { InternshipProposalModel } from "../schemas/internship-proposal.schema";
import { Model } from "mongoose";
import { types } from "../di-types";

/**
 * The [[InternshipsProposalsRepository]] repository
 */
@injectable()
export class InternshipsProposalsRepository extends BaseRepository<InternshipProposal> {

    /**
     * Initialize [[UsersRepository]]
     * @param internshipProposalModel The injected [[InternshipProposalModel]] model
     */
    constructor(
        @inject(types.Models.InternShipProposal) protected internshipProposalModel: Model<InternshipProposal>) {

        // Initialize [[BaseRepository]] 
        super(internshipProposalModel, Defaults.collectionsName.internshipProposals);
    }

}