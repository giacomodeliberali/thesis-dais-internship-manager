"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dist_1 = require("gdl-thesis-core/dist");
const base_1 = require("./base");
const autopopulate = require("mongoose-autopopulate");
const auth_type_enum_1 = require("gdl-thesis-core/dist/models/enums/auth-type.enum");
const bcrypt = require('bcrypt');
/** The [[User]] mongoose schema */
exports.UserSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed,
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
        enum: [auth_type_enum_1.AuthType.Local, auth_type_enum_1.AuthType.Google],
        required: true
    },
    image: String
});
/** Ensure returned object has property id instead of _id and __v */
exports.UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        base_1.normalize(doc, ret, options);
        delete ret.password;
    }
});
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.authType !== auth_type_enum_1.AuthType.Local)
                return next();
            // Generate a salt
            const salt = yield bcrypt.genSalt(10);
            // Generate a password hash (salt + hash)
            const passwordHash = yield bcrypt.hash(this.password, salt);
            // Re-assign hashed version over original, plain text password
            this.password = passwordHash;
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.UserSchema.methods.isValidPassword = function (newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield bcrypt.compare(newPassword, this.password);
        }
        catch (error) {
            throw new Error(error);
        }
    });
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
exports.UserSchema.plugin(autopopulate);
/** The [[UserModel]] mongoose schema model  */
exports.UserModel = mongoose_1.model("User", exports.UserSchema, dist_1.Defaults.collectionsName.users);
