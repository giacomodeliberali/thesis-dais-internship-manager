import { Document, Schema, Model, model } from "mongoose";
import { Defaults, InternshipProposal } from "gdl-thesis-core/dist";
import { normalize } from "./base";

/** The [[InternshipProposalSchema]] mongoose schema */
export const InternshipProposalSchema: Schema = new Schema({
    id: String,
    internship: {
        type: Schema.Types.ObjectId, ref: 'Internship'
    },
    student: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    professor: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    creationDate: Date,
    status: Number
});


InternshipProposalSchema.set('toJSON', {
    transform: normalize
});

/** Auto populates 'internship,student,professor' properties before any 'find' and 'findOne' */
const autoPopulateReferences = function (next: Function) {
    this.populate('internship');
    this.populate('student');
    this.populate('professor');
    next();
};

InternshipProposalSchema.pre("find", autoPopulateReferences);
InternshipProposalSchema.pre("findOne", autoPopulateReferences);

/** The [[InternshipProposalModel]] mongoose schema model  */
export const InternshipProposalModel: Model<InternshipProposal> = model<InternshipProposal>("InternshipProposal", InternshipProposalSchema, Defaults.collectionsName.internshipProposals);