/**
 * The [[InternshipsProposalsRepository]] repository
 */
@injectable()
export class InternshipsProposalsRepository extends 
            BaseRepository<IInternshipProposal, InternshipProposal> {

    /**
     * Initialize [[InternshipsProposalsRepository]]
     */
    constructor(
        // The injected [[InternshipProposalModel]] model
        @inject(types.Models.InternShipProposal)
        protected internshipProposalModel: Model<IInternshipProposal>,

        // The lazy-injected [[InternshipsRepository]] repository
        // (lazy to avoid circular-dependencies errors)
        @inject(new LazyServiceIdentifer(() => InternshipsRepository))
        private internshipRepository: InternshipsRepository) {

        // Initialize [[BaseRepository]] 
        super(internshipProposalModel, 
                    Defaults.collectionsName.internshipProposals);
    }

    /**
     * Return the number of available places for an internship
     * @param internshipId The internship id
     */
    public async getAvailablePlaces(internshipId: string) {
        ...
    }

}