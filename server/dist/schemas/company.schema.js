"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const thesis_dais_internship_manager_core_1 = require("thesis-dais-internship-manager-core");
const base_1 = require("./base");
const autopopulate = require("mongoose-autopopulate");
/** The [[Company]] mongoose schema */
exports.CompanySchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: true
        }
    ],
    registrationDate: Date
});
/** Ensure returned object has property id instead of _id and __v */
base_1.normalizeSchema(exports.CompanySchema);
/** Auto populates 'owners' property before any 'find' and 'findOne' */
exports.CompanySchema.plugin(autopopulate);
/** The [[CompanyModel]] mongoose schema model  */
exports.CompanyModel = mongoose_1.model("Company", exports.CompanySchema, thesis_dais_internship_manager_core_1.Defaults.collectionsName.companies);
