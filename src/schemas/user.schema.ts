import { Document, Schema, Model, model, SchemaType } from "mongoose";
import { IUser, Defaults } from "gdl-thesis-core/dist";
import { normalize } from "./base";
import * as autopopulate from "mongoose-autopopulate";
import { RoleModel } from "./role.schema";
import { ObjectID } from "bson";

/** The [[User]] mongoose schema */
export const UserSchema: Schema = new Schema({
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
        type: Schema.Types.Mixed,
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
UserSchema.set('toJSON', {
    transform: normalize
});
/*
const assemblyReferences = async function (next: Function) {

    // Populate role
    if (this.role) {
        this.role = this.role.id as any;
    }

    if (this._update && this._update.role) {
        this._update.role = this._update.role.id;
    }
    next();
};

// Update referenced fields
UserSchema.pre<IUser>('validate', assemblyReferences);
UserSchema.pre<IUser>('findOneAndUpdate', assemblyReferences);
*/

/** Auto populates 'Role' property before any 'find' and 'findOne' */
UserSchema.plugin(autopopulate);

/** The [[UserModel]] mongoose schema model  */
export const UserModel = model<IUser>("User", UserSchema, Defaults.collectionsName.users);