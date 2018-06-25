import { Document, Schema, Model, model } from "mongoose";
import { normalizeToJson, normalizeSchema } from "./base";
import { IRole } from "../models/interfaces";
import { Defaults } from "gdl-thesis-core/dist";

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
export const RoleModel = model<IRole>("Role", RoleSchema, Defaults.collectionsName.roles);