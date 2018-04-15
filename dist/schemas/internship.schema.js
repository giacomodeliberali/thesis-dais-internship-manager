"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
const base_1 = require("./base");
/** The [[Internship]] mongoose schema */
exports.InternshipSchema = new mongoose_1.Schema({
    id: String,
    company: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Company'
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
exports.InternshipSchema.set('toJSON', {
    transform: base_1.normalize
});
/** Auto populates 'company' property before any 'find' and 'findOne' */
const autoPopulateReferences = function (next) {
    this.populate('company');
    next();
};
exports.InternshipSchema.pre("find", autoPopulateReferences);
exports.InternshipSchema.pre("findOne", autoPopulateReferences);
/** The [[CompanyModel]] mongoose schema model  */
exports.InternshipModel = mongoose_1.model("Internship", exports.InternshipSchema, dist_1.Defaults.collectionsName.internships);
