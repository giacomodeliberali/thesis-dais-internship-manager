import { BaseRepository } from "./base";
import { Defaults, IInternshipProposal, InternshipProposal } from "gdl-thesis-core/dist";
import { inject, injectable } from "inversify";
import { InternshipProposalModel } from "../schemas/internship-proposal.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";

/**
 * The [[InternshipsProposalsRepository]] repository
 */
@injectable()
export class InternshipsProposalsRepository extends BaseRepository<IInternshipProposal, InternshipProposal> {

    /**
     * Initialize [[UsersRepository]]
     * @param internshipProposalModel The injected [[InternshipProposalModel]] model
     */
    constructor(
        @inject(types.Models.InternShipProposal) protected internshipProposalModel: Model<IInternshipProposal>) {

        // Initialize [[BaseRepository]] 
        super(internshipProposalModel, Defaults.collectionsName.internshipProposals);
    }

}