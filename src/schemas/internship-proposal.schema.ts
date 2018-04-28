import { Document, Schema, Model, model } from "mongoose";
import { Defaults } from "gdl-thesis-core/dist";
import { normalizeToJson, normalizeSchema } from "./base";
import * as autopopulate from "mongoose-autopopulate";
import { IInternshipProposal } from "../models/interfaces";

/** The [[InternshipProposalSchema]] mongoose schema */
export const InternshipProposalSchema: Schema = new Schema({
    internship: {
        type: Schema.Types.ObjectId,
        ref: 'Internship',
        autopopulate: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    creationDate: Date,
    status: Number
});


/** Ensure returned object has property id instead of _id and __v */
normalizeSchema(InternshipProposalSchema);

/** Auto populates 'internship,student,professor' properties before any 'find' and 'findOne' */
InternshipProposalSchema.plugin(autopopulate);

/** The [[InternshipProposalModel]] mongoose schema model  */
export const InternshipProposalModel = model<IInternshipProposal>("InternshipProposal", InternshipProposalSchema, Defaults.collectionsName.internshipProposals);