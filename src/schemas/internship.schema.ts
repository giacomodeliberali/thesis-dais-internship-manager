import { Document, Schema, Model, model } from "mongoose";
import { User, Defaults, Company, Internship } from "gdl-thesis-core/dist";
import { normalize } from "./base";

/** The [[Internship]] mongoose schema */
export const InternshipSchema: Schema = new Schema({
    id: String,
    company: {
        type: Schema.Types.ObjectId, ref: 'Company'
    },
    startDate: Date,
    endDate: Date,
    totalHours: Number,
    address: String,
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


InternshipSchema.set('toJSON', {
    transform: normalize
});

/** Auto populates 'company' property before any 'find' and 'findOne' */
const autoPopulateReferences = function (next: Function) {
    this.populate('company');
    next();
};

InternshipSchema.pre("find", autoPopulateReferences);
InternshipSchema.pre("findOne", autoPopulateReferences);

/** The [[CompanyModel]] mongoose schema model  */
export const InternshipModel: Model<Internship> = model<Internship>("Internship", InternshipSchema, Defaults.collectionsName.internships);