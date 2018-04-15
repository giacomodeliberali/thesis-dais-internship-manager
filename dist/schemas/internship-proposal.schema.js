"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
const base_1 = require("./base");
/** The [[InternshipProposalSchema]] mongoose schema */
exports.InternshipProposalSchema = new mongoose_1.Schema({
    id: String,
    internship: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Internship'
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'User'
    },
    professor: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'User'
    },
    creationDate: Date,
    status: Number
});
exports.InternshipProposalSchema.set('toJSON', {
    transform: base_1.normalize
});
/** Auto populates 'internship,student,professor' properties before any 'find' and 'findOne' */
const autoPopulateReferences = function (next) {
    this.populate('internship');
    this.populate('student');
    this.populate('professor');
    next();
};
exports.InternshipProposalSchema.pre("find", autoPopulateReferences);
exports.InternshipProposalSchema.pre("findOne", autoPopulateReferences);
/** The [[InternshipProposalModel]] mongoose schema model  */
exports.InternshipProposalModel = mongoose_1.model("InternshipProposal", exports.InternshipProposalSchema, dist_1.Defaults.collectionsName.internshipProposals);
