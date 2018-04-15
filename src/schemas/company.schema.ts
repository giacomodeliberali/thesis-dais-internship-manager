import { Document, Schema, Model, model } from "mongoose";
import { User, Defaults, Company } from "gdl-thesis-core/dist";
import { normalize } from "./base";

/** The [[Company]] mongoose schema */
export const CompanySchema: Schema = new Schema({
    id: String,
    name: String,
    address: String,
    status: Number,
    vatCode: String,
    phones: [
        {
            type: String
        }
    ],
    owners: [
        {
            type: Schema.Types.ObjectId, ref: 'User'
        }
    ],
    registrationDate: Date
});


CompanySchema.set('toJSON', {
    transform: normalize
});

/** Auto populates 'owners' property before any 'find' and 'findOne' */
const autoPopulateOwners = function (next: Function) {
    this.populate('owners');
    next();
};

CompanySchema.pre("find", autoPopulateOwners);
CompanySchema.pre("findOne", autoPopulateOwners);

/** The [[CompanyModel]] mongoose schema model  */
export const CompanyModel: Model<Company> = model<Company>("Company", CompanySchema, Defaults.collectionsName.companies);