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
const di_types_1 = require("../di-types");
const jsonwebtoken_1 = require("jsonwebtoken");
const environment_1 = require("../environment");
const dist_1 = require("gdl-thesis-core/dist");
/**
 * The Auth controller
 */
let AuthenticationController = class AuthenticationController {
    /**
     * Create the controller that handles authentication
     * @param app The express application used to register a new route for this controller
     */
    constructor(app) {
        this.app = app;
        /** The express router */
        this.router = express_1.Router();
        this.useAuth();
    }
    /**
     * Enable JWT generation and verification
     */
    useAuth() {
        this.router.post('/token', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers['token'];
            if (token) {
                // Verify token
                try {
                    const isValid = jsonwebtoken_1.verify(token, environment_1.environment.jwtSecret);
                    // Is is valid return it
                    if (isValid)
                        return new dist_1.ApiResponse({
                            response: res,
                            httpCode: 200,
                            data: token
                        }).send();
                    // Check if has body
                    if (!req.body) {
                        return new dist_1.ApiResponse({
                            response: res,
                            httpCode: 400,
                            exception: "Bad request"
                        }).send();
                    }
                    // Return a new token
                    return jsonwebtoken_1.sign(req.body, environment_1.environment.jwtSecret);
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
                // Check if has body
                if (!req.body) {
                    return new dist_1.ApiResponse({
                        response: res,
                        httpCode: 400,
                        exception: "Bad request"
                    }).send();
                }
                // Return a new token
                return new dist_1.ApiResponse({
                    response: res,
                    httpCode: 200,
                    data: jsonwebtoken_1.sign(req.body, environment_1.environment.jwtSecret)
                }).send();
            }
        }));
        // Decodes the information about the given token
        this.router.get('/token', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    handleMissingRoutes() {
        // Add 404 handler
        this.app.all('*', (req, res) => {
            return new dist_1.ApiResponse({
                data: null,
                exception: new Error("Route not found"),
                httpCode: 404,
                response: res,
            }).send();
        });
        return this;
    }
    /**
     * Register this controller routes to the global express application
     */
    register() {
        this.app.use(`/auth`, this.router);
        return this;
    }
};
AuthenticationController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(di_types_1.types.App)),
    __metadata("design:paramtypes", [Object])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
