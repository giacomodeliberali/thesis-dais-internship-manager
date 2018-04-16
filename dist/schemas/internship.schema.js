"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
const base_1 = require("./base");
const autopopulate = require("mongoose-autopopulate");
/** The [[Internship]] mongoose schema */
exports.InternshipSchema = new mongoose_1.Schema({
    id: String,
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.InternshipSchema.set('toJSON', {
    transform: base_1.normalize
});
/** Auto populates 'company' property before any 'find' and 'findOne' */
exports.InternshipSchema.plugin(autopopulate);
/** The [[CompanyModel]] mongoose schema model  */
exports.InternshipModel = mongoose_1.model("Internship", exports.InternshipSchema, dist_1.Defaults.collectionsName.internships);
