import { Document, Schema, Model, model, SchemaType } from "mongoose";
import { IUser, Defaults } from "gdl-thesis-core/dist";
import { normalize } from "./base";
import * as autopopulate from "mongoose-autopopulate";
import { RoleModel } from "./role.schema";
import { ObjectID } from "bson";
import { AuthType } from "gdl-thesis-core/dist/models/enums/auth-type.enum";
const bcrypt = require('bcrypt');

/** The [[User]] mongoose schema */
export const UserSchema: Schema = new Schema({
    id: String,
    name: String,
    email: {
        type: String,
        index: {
            unique: true
        },
        required: true
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
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        required: false
    },
    authType: {
        type: Number,
        enum: [AuthType.Local, AuthType.Google],
        required: true
    },
    image: String
});

/** Ensure returned object has property id instead of _id and __v */
UserSchema.set('toJSON', {
    transform: function (doc: IUser, ret: IUser, options: any) {
        normalize(doc, ret, options);
        delete ret.password;
    }
});

UserSchema.pre<IUser>('save', async function (next) {
    try {
        if (this.authType !== AuthType.Local)
            return next();

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(this.password, salt);
        // Re-assign hashed version over original, plain text password
        this.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function (newPassword: string) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};
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