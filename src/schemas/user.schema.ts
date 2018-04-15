import { Document, Schema, Model, model } from "mongoose";
import { User, Defaults, Company } from "gdl-thesis-core/dist";
import { normalize } from "./base";

/** The [[User]] mongoose schema */
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
const autoPopulateReferences = function (next: Function) {
    this.populate('role');
    next();
};

UserSchema.pre("find", autoPopulateReferences);
UserSchema.pre("findOne", autoPopulateReferences);

/** The [[UserModel]] mongoose schema model  */
export const UserModel: Model<User> = model<User>("User", UserSchema, Defaults.collectionsName.users);