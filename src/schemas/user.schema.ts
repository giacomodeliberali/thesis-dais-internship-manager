import { Document, Schema, Model, model } from "mongoose";
import { User, Defaults } from "gdl-thesis-core/dist";
import { normalize } from "./base";

/** The [[user]] mongoose schema */
export const UserSchema: Schema = new Schema({
    id: String,
    name: String,
    email: String,
    phone: [
        {
            type: String
        }
    ],
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    birthDate: Date,
    registrationDate: Date
});


UserSchema.set('toJSON', {
    transform: normalize
});

/** Auto populates 'role' property before any 'find' and 'findOne' */
const autoPopulateRole = function (next: Function) {
    this.populate('role');
    next();
};

UserSchema.pre("find", autoPopulateRole);
UserSchema.pre("findOne", autoPopulateRole);

/** The [[UserModel]] mongoose schema model  */
export const UserModel: Model<User> = model<User>("User", UserSchema, Defaults.collectionsName.users);