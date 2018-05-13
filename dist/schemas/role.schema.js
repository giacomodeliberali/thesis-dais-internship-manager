"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const base_1 = require("./base");
const dist_1 = require("gdl-thesis-core/dist");
/** The [[Role]] mongoose schema */
exports.RoleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true
    },
    type: Number
});
/** Ensure returned object has property id instead of _id and __v */
base_1.normalizeSchema(exports.RoleSchema);
/** The [[RoleModel]] mongoose schema model  */
exports.RoleModel = mongoose_1.model("Role", exports.RoleSchema, dist_1.Defaults.collectionsName.roles);
