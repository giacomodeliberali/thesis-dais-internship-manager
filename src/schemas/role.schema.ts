import { Document, Schema, Model, model } from "mongoose";
import { IRole, Defaults } from "gdl-thesis-core/dist";
import { normalizeToJson, normalizeSchema } from "./base";

/** The [[Role]] mongoose schema */
export const RoleSchema: Schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    type: Number
});

/** Ensure returned object has property id instead of _id and __v */
normalizeSchema(RoleSchema);

/** The [[RoleModel]] mongoose schema model  */
export const RoleModel = model<IRole>("Role", RoleSchema, "roles");