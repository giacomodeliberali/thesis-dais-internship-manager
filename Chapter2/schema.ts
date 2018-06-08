/** The [[InternshipProposal]] mongoose schema model  */
export const InternshipProposalSchema: Schema = new Schema({
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