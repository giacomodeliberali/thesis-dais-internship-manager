import { Document, Schema, Model, model } from "mongoose";
import { Role, Defaults } from "gdl-thesis-core/dist";
import { normalize } from "./base";

/** The [[Role]] mongoose schema */
export const RoleSchema: Schema = new Schema({
    id: String,
    name: {
        type: String,
        unique: true
    },
    type: Number
});

/** Ensure returned object has property id instead of _id and __v */
RoleSchema.set('toJSON', {
    transform: normalize
});

/** The [[RoleModel]] mongoose schema model  */
export const RoleModel: Model<Role> = model<Role>("Role", RoleSchema, "roles");