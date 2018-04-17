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
const express_1 = require("express");
const inversify_1 = require("inversify");
const di_types_1 = require("../utils/di-types");
const jsonwebtoken_1 = require("jsonwebtoken");
const environment_1 = require("../environment");
const dist_1 = require("gdl-thesis-core/dist");
const repositories_1 = require("../repositories");
/**
 * The Auth controller
 */
let AuthenticationController = class AuthenticationController {
    /**
     * Create the controller that handles authentication
     * @param app The express application used to register a new route for this controller
     */
    constructor(usersRepository, app) {
        this.usersRepository = usersRepository;
        this.app = app;
        /** The express router */
        this.router = express_1.Router();
    }
    /**
   * Register this controller routes
   * @param useAllCustom Indicates if the custom routes should be registred automatically [default true]
   */
    register(useAllCustom = true) {
        if (useAllCustom)
            this.useAllCustom();
        this.app.use(`/auth`, this.router);
        return this;
    }
    /**
     * Use custom routes
     */
    useAllCustom() {
        return this
            .useLogin()
            .useRegister()
            .useDecode();
    }
    /**
     * Decodes the information about the given token
     */
    useDecode() {
        this.router.get('/token/decode', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers['token'];
            if (token) {
                try {
                    const isValid = jsonwebtoken_1.verify(token, environment_1.environment.jwtSecret);
                    if (isValid)
                        return new dist_1.ApiResponse({
                            response: res,
                            httpCode: 200,
                            data: jsonwebtoken_1.decode(token)
                        }).send();
                    else
                        return new dist_1.ApiResponse({
                            response: res,
                            httpCode: 200,
                            data: {
                                message: "Invalid token"
                            }
                        }).send();
                }
                catch (ex) {
                    return new dist_1.ApiResponse({
                        response: res,
                        httpCode: 500,
                        exception: ex
                    }).send();
                }
            }
            else {
                return new dist_1.ApiResponse({
                    response: res,
                    httpCode: 400,
                    exception: "Bad request"
                }).send();
            }
        }));
        return this;
    }
    /**
     * Login in a user and generate its token
     */
    useLogin() {
        this.router.post('/login', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Check if has body
            if (!req.body || (req.body && (!req.body.password || !req.body.email))) {
                return new dist_1.ApiResponse({
                    response: res,
                    httpCode: 400,
                    exception: {
                        message: "Bad request. Required parameters are 'email' and 'password'"
                    }
                }).send();
            }
            const user = yield this.usersRepository.login(req.body.email, req.body.password);
            if (user) {
                // Return a new token
                return new dist_1.ApiResponse({
                    response: res,
                    httpCode: 200,
                    data: jsonwebtoken_1.sign(user.toJSON(), environment_1.environment.jwtSecret)
                }).send();
            }
            // Return a new token
            return new dist_1.ApiResponse({
                response: res,
                httpCode: 401,
                exception: {
                    message: "Bad login attempt"
                }
            }).send();
        }));
        return this;
    }
    /**
     * Register a new user and generate its token
     */
    useRegister() {
        this.router.post('/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Check if has body
            console.log("REGISTER", req.body);
            if (!req.body || (req.body && (!req.body.password || !req.body.email))) {
                return new dist_1.ApiResponse({
                    response: res,
                    httpCode: 400,
                    exception: {
                        message: "Bad request. Required parameters are 'email' and 'password'"
                    }
                }).send();
            }
            const user = yield this.usersRepository
                .register(req.body)
                .catch(ex => {
                // Return a new token
                return new dist_1.ApiResponse({
                    response: res,
                    httpCode: 500,
                    exception: ex
                }).send();
            });
            if (user) {
                // Return a new token
                return new dist_1.ApiResponse({
                    response: res,
                    httpCode: 200,
                    data: {
                        user: user,
                        token: jsonwebtoken_1.sign(user, environment_1.environment.jwtSecret)
                    }
                }).send();
            }
            // Return a new token
            return new dist_1.ApiResponse({
                response: res,
                httpCode: 500,
                exception: {
                    message: "Something went wrong creating a new user"
                }
            }).send();
        }));
        return this;
    }
    /**
     * Handle all 404 routes.
     *
     * Must be called *after* every controller registration.
     */
    handleMissingRoutes() {
        // Add 404 handler
        this.app.all('*', (req, res) => {
            return new dist_1.ApiResponse({
                data: null,
                exception: {
                    message: "Route not found"
                },
                httpCode: 404,
                response: res,
            }).send();
        });
        return this;
    }
};
AuthenticationController = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(di_types_1.types.App)),
    __metadata("design:paramtypes", [repositories_1.UsersRepository, Object])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
