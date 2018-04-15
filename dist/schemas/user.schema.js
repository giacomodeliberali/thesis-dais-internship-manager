"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
const base_1 = require("./base");
/** The [[User]] mongoose schema */
exports.UserSchema = new mongoose_1.Schema({
    id: String,
    name: String,
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    phone: [
        {
            type: String
        }
    ],
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role' },
    birthDate: Date,
    registrationDate: Date,
    residenceAddress: {
        street: String,
        number: String,
        floor: String,
        city: String,
        zip: String,
        state: String,
        country: String
    }
});
exports.UserSchema.set('toJSON', {
    transform: base_1.normalize
});
/** Auto populates 'role' property before any 'find' and 'findOne' */
const autoPopulateReferences = function (next) {
    this.populate('role');
    next();
};
exports.UserSchema.pre("find", autoPopulateReferences);
exports.UserSchema.pre("findOne", autoPopulateReferences);
/** The [[UserModel]] mongoose schema model  */
exports.UserModel = mongoose_1.model("User", exports.UserSchema, dist_1.Defaults.collectionsName.users);
