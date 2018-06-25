import { BaseRepository } from "./base";
import { Defaults, InternshipProposal, InternshipProposalStatusType } from "thesis-dais-internship-manager-core";
import { inject, injectable, LazyServiceIdentifer } from "inversify";
import { InternshipProposalModel } from "../schemas/internship-proposal.schema";
import { Model } from "mongoose";
import { types } from "../utils/di-types";
import { IInternshipProposal } from "../models/interfaces";
import { InternshipsRepository } from ".";

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
        @inject(types.Models.InternShipProposal)
        protected internshipProposalModel: Model<IInternshipProposal>,

        @inject(new LazyServiceIdentifer(() => InternshipsRepository))
        private internshipRepository: InternshipsRepository) {

        // Initialize [[BaseRepository]] 
        super(internshipProposalModel, Defaults.collectionsName.internshipProposals);
    }

    /**
     * Return the number of available places for an internship
     * @param internshipId The internship id
     */
    async getAvailablePlaces(internshipId: string) {
        const proposals = await this.find({
            internship: internshipId as any,
            status: InternshipProposalStatusType.Confirmed
        });

        const internship = await this.internshipRepository.get(internshipId);

        if (proposals && internship)
            return internship.studentsNumber - proposals.length;

        if (internship)
            return internship.studentsNumber;

        return 0;
    }

}