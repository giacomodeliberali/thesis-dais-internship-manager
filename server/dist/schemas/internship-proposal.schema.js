"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const thesis_dais_internship_manager_core_1 = require("thesis-dais-internship-manager-core");
const base_1 = require("./base");
const autopopulate = require("mongoose-autopopulate");
/** The [[InternshipProposalSchema]] mongoose schema */
exports.InternshipProposalSchema = new mongoose_1.Schema({
    internship: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Internship',
        autopopulate: true
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    professor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    creationDate: mongoose_1.Schema.Types.Date,
    endDate: mongoose_1.Schema.Types.Date,
    startDate: mongoose_1.Schema.Types.Date,
    status: mongoose_1.Schema.Types.Number,
    attendances: [
        {
            date: {
                type: mongoose_1.Schema.Types.Date,
                required: true
            },
            hours: {
                type: mongoose_1.Schema.Types.Number,
                required: true
            }
        }
    ]
});
/** Ensure returned object has property id instead of _id and __v */
base_1.normalizeSchema(exports.InternshipProposalSchema);
/** Auto populates 'internship,student,professor' properties before any 'find' and 'findOne' */
exports.InternshipProposalSchema.plugin(autopopulate);
/** The [[InternshipProposalModel]] mongoose schema model  */
exports.InternshipProposalModel = mongoose_1.model("InternshipProposal", exports.InternshipProposalSchema, thesis_dais_internship_manager_core_1.Defaults.collectionsName.internshipProposals);
