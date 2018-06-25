/** The [[InternshipProposal]] mongoose schema model  */
const InternshipProposalSchema: Schema = new Schema({
    attendances: [
        {
            date: {
                type: Schema.Types.Date,
                required: true
            },
            ...
        }
    ],
    internship: {
        type: Schema.Types.ObjectId,
        ref: 'Internship',
        autopopulate: true
    },
    status: Schema.Types.Number,
    ...
});

/** The [[InternshipProposalModel]] mongoose schema model  */
export const InternshipProposalModel = model<IInternshipProposal>(
        "InternshipProposal",
        InternshipProposalSchema, 
        Defaults.collectionsName.internshipProposals
    );