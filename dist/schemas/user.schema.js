"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
const base_1 = require("./base");
const autopopulate = require("mongoose-autopopulate");
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
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        autopopulate: true
    },
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
/** Ensure returned object has property id instead of _id and __v */
exports.UserSchema.set('toJSON', {
    transform: base_1.normalize
});
/** Auto populates 'Role' property before any 'find' and 'findOne' */
exports.UserSchema.plugin(autopopulate);
/** The [[UserModel]] mongoose schema model  */
exports.UserModel = mongoose_1.model("User", exports.UserSchema, dist_1.Defaults.collectionsName.users);
