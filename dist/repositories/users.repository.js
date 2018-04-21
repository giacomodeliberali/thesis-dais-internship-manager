"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const dist_1 = require("gdl-thesis-core/dist");
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const di_types_1 = require("../utils/di-types");
const bcrypt = require('bcrypt');
/**
 * The [[user]] repository
 */
let UsersRepository = class UsersRepository extends base_1.BaseRepository {
    /**
     * Initialize [[UsersRepository]]
     * @param roleModel The injected [[UserSchema]] model
     */
    constructor(userModel) {
        // Initialize [[BaseRepository]] 
        super(userModel, dist_1.Defaults.collectionsName.users);
        this.userModel = userModel;
    }
    /**
     * Return all users with role matching al least one of the given roles
     */
    getByRoles(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.find();
            return users.filter(u => {
                if (u.role) {
                    if (Array.isArray(roles)) {
                        for (let i = 0; i < roles.length; i++) {
                            if ((Number(u.role.type) & Number(roles[i])) === Number(roles[i]))
                                return true;
                        }
                    }
                    else {
                        if ((Number(u.role.type) & Number(roles)) === Number(roles))
                            return true;
                    }
                }
                return false;
            });
        });
    }
    /**
     * Return the user if the email and password are matching, null otherwise
     * @param email The user email
     * @param password The user password
     */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findOne({ email: email })
                .then(user => {
                if (user && user.isValidPassword(password))
                    return Promise.resolve(user);
                else
                    return Promise.reject({
                        message: "Bad login attempt",
                        code: "auth/bad-login"
                    });
            })
                .catch((ex) => {
                return Promise.reject(ex);
            });
        });
    }
    /**
     * Create a new user
     * @param user The user to register
     */
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!user)
                    return Promise.resolve(null);
                if (!user.password || !user.email)
                    return Promise.resolve(null);
                const exist = yield this.model.findOne({ email: user.email });
                if (exist) {
                    return Promise.reject({
                        message: "Email already taken",
                        code: "auth/email-taken"
                    });
                }
                user.registrationDate = new Date();
                return this.update(user);
            }
            catch (ex) {
                return Promise.reject({
                    message: "Error creating a new user",
                    error: ex
                });
            }
        });
    }
};
UsersRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(di_types_1.types.Models.User)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UsersRepository);
exports.UsersRepository = UsersRepository;
