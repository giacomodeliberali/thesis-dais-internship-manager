import { Document, Schema, Model, model } from "mongoose";
import { Defaults } from "gdl-thesis-core/dist";
import { normalizeToJson, normalizeSchema } from "./base";
import * as autopopulate from "mongoose-autopopulate";
import { IInternship } from "../models/interfaces";

/** The [[Internship]] mongoose schema */
export const InternshipSchema: Schema = new Schema({
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
normalizeSchema(InternshipSchema);


/** Auto populates 'company' property before any 'find' and 'findOne' */
InternshipSchema.plugin(autopopulate);

/** The [[CompanyModel]] mongoose schema model  */
export const InternshipModel = model<IInternship>("Internship", InternshipSchema, Defaults.collectionsName.internships);