"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
const base_1 = require("./base");
/** The [[Company]] mongoose schema */
exports.CompanySchema = new mongoose_1.Schema({
    id: String,
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
            type: mongoose_1.Schema.Types.ObjectId, ref: 'User'
        }
    ],
    registrationDate: Date
});
exports.CompanySchema.set('toJSON', {
    transform: base_1.normalize
});
/** Auto populates 'owners' property before any 'find' and 'findOne' */
const autoPopulateReferences = function (next) {
    this.populate('owners');
    next();
};
exports.CompanySchema.pre("find", autoPopulateReferences);
exports.CompanySchema.pre("findOne", autoPopulateReferences);
/** The [[CompanyModel]] mongoose schema model  */
exports.CompanyModel = mongoose_1.model("Company", exports.CompanySchema, dist_1.Defaults.collectionsName.companies);
