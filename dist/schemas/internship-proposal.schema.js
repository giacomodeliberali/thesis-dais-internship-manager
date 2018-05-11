"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
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
    creationDate: Date,
    status: Number
});
/** Ensure returned object has property id instead of _id and __v */
base_1.normalizeSchema(exports.InternshipProposalSchema);
/** Auto populates 'internship,student,professor' properties before any 'find' and 'findOne' */
exports.InternshipProposalSchema.plugin(autopopulate);
/** The [[InternshipProposalModel]] mongoose schema model  */
exports.InternshipProposalModel = mongoose_1.model("InternshipProposal", exports.InternshipProposalSchema, dist_1.Defaults.collectionsName.internshipProposals);
//# sourceMappingURL=internship-proposal.schema.js.map