import { Document, Schema, Model, model } from "mongoose";
import { Defaults, IInternship } from "gdl-thesis-core/dist";
import { normalize } from "./base";
import * as autopopulate from "mongoose-autopopulate";

/** The [[Internship]] mongoose schema */
export const InternshipSchema: Schema = new Schema({
    id: String,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: true
    },
    startDate: Date,
    endDate: Date,
    totalHours: Number,
    address: {
        street: String,
        number: String,
        floor: String,
        city: String,
        zip: String,
        state: String,
        country: String
    },
    description: String,
    title: String,
    tags: [
        {
            type: String
        }
    ],
    studentsNumber: Number,
    status: Number,
    rejectReason: String
});


/** Ensure returned object has property id instead of _id and __v */
InternshipSchema.set('toJSON', {
    transform: normalize
});

/** Auto populates 'company' property before any 'find' and 'findOne' */
InternshipSchema.plugin(autopopulate);

/** The [[CompanyModel]] mongoose schema model  */
export const InternshipModel = model<IInternship>("Internship", InternshipSchema, Defaults.collectionsName.internships);