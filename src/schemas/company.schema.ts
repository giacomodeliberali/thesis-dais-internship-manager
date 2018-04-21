import { Document, Schema, Model, model } from "mongoose";
import { User, Defaults, ICompany } from "gdl-thesis-core/dist";
import { normalizeToJson, normalizeSchema } from "./base";
import * as autopopulate from "mongoose-autopopulate";

/** The [[Company]] mongoose schema */
export const CompanySchema: Schema = new Schema({
    name: String,
    address: {
        street: String,
        number: String,
        floor: String,
        city: String,
        zip: String,
        state: String,
        country: String
    },
    status: Number,
    vatCode: String,
    owners: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: true
        }
    ],
    registrationDate: Date
});

/** Ensure returned object has property id instead of _id and __v */
normalizeSchema(CompanySchema);

/** Auto populates 'owners' property before any 'find' and 'findOne' */
CompanySchema.plugin(autopopulate);

/** The [[CompanyModel]] mongoose schema model  */
export const CompanyModel = model<ICompany>("Company", CompanySchema, Defaults.collectionsName.companies);