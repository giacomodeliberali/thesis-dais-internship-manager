import { Document, Schema, Model, model } from "mongoose";
import { User, Defaults, Company } from "gdl-thesis-core/dist";
import { normalize } from "./base";
import * as autopopulate from "mongoose-autopopulate";

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
        type: Schema.Types.ObjectId,
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

/** Auto populates 'Role' property before any 'find' and 'findOne' */
UserSchema.plugin(autopopulate);

/** The [[UserModel]] mongoose schema model  */
export const UserModel: Model<User> = model<User>("User", UserSchema, Defaults.collectionsName.users);