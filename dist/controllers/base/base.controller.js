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
const repositories_1 = require("../../repositories");
const dist_1 = require("gdl-thesis-core/dist");
const inversify_1 = require("inversify");
const jsonwebtoken_1 = require("jsonwebtoken");
const environment_1 = require("../../environment");
const ServerDefaults_1 = require("../../ServerDefaults");
const scopes_1 = require("../../utils/auth/scopes");
/**
 * The base controller with CRUD and authentication
 */
let BaseController = class BaseController {
    /**
     * Create a new base controller and attaches CRUD method with 'routeName' express route
     * @param baseRepository The generic base repository with CRUD operations
     * @param app The express application used to register a new route for this controller
     */
    constructor(baseRepository, app) {
        this.baseRepository = baseRepository;
        this.app = app;
        /** The express router */
        this.router = express_1.Router();
        /** Indicates if the authentication has been enabled in this controller */
        this.isAuthEnabled = false;
    }
    /** The collection name */
    get routeName() {
        return this.baseRepository.collectionName;
    }
    useMiddleware(middleware) {
        if (middleware && middleware.length) {
            this.router.use(middleware);
        }
        return this;
    }
    /**
     * Attach to the current route the CRUD operations.
     *
     * A user scope can be specified using a scope middleware.
     *
     * Delete operation required Admin scope by default in all callection
     */
    useCrud(options) {
        return this
            .useMiddleware(options ? options.middleware : null)
            .useCreate(options && options.createUpdate ? options.createUpdate.middleware : null)
            .useRead(options && options.read ? options.read.middleware : null)
            .useDelete(options && options.delete ? options.delete.middleware : this.isAuthEnabled ? [scopes_1.adminScope] : null);
    }
    /**
     * Attach to the current route the create operation
     *
     * A user scope can be specified using a scope middleware.
     */
    useCreate(middleware) {
        this.useMiddleware(middleware);
        this.router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`POST [${this.routeName}]`);
            this.baseRepository.update(req.body)
                .then(result => {
                return new dist_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            }).catch(ex => {
                return new dist_1.ApiResponse({
                    data: null,
                    httpCode: 500,
                    response: res,
                    exception: ex
                }).send();
            });
        }));
        return this;
    }
    /**
     * Attach to the current route the read all and ready by id operation
     *
     * A user scope can be specified using a scope middleware.
     */
    useRead(middleware) {
        this.useMiddleware(middleware);
        this.router.get('/', (req, res) => {
            console.log(`GET [${this.routeName}/]`);
            return this.baseRepository.find()
                .then(value => {
                return new dist_1.ApiResponse({
                    data: value,
                    httpCode: 200,
                    response: res
                }).send();
            }).catch(error => {
                return new dist_1.ApiResponse({
                    data: null,
                    httpCode: 500,
                    response: res,
                    exception: error
                }).send();
            });
        });
        this.router.get('/:id', (req, res) => {
            console.log(`GET [${this.routeName}/${req.params.id}]`);
            this.baseRepository.get(req.params.id)
                .then(result => {
                return new dist_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            }).catch(ex => {
                return new dist_1.ApiResponse({
                    data: null,
                    httpCode: 500,
                    response: res,
                    exception: ex
                }).send();
            });
        });
        return this;
    }
    /**
     * Attach to the current route the delete operation
     *
     * A user scope can be specified using a scope middleware.
     */
    useDelete(middleware) {
        this.useMiddleware(middleware);
        this.router.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`DELETE [${this.routeName}/${req.params.id}]`);
            this.baseRepository.delete(req.params.id)
                .then(result => {
                return new dist_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            }).catch(ex => {
                return new dist_1.ApiResponse({
                    data: null,
                    httpCode: 500,
                    response: res,
                    exception: ex
                }).send();
            });
        }));
        return this;
    }
    /**
     * Enable JWT token verification. Every method called after this call will use authentication
     *
     * A user scope can be specified using a scope middleware.
     *
     * @param use Indicate if the authentication must be used or not - default true
     */
    useAuth(use = true) {
        this.isAuthEnabled = use;
        if (use) {
            this.router.use('*', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const token = req.headers[ServerDefaults_1.ServerDefaults.jwtTokenHeaderName];
                    if (token) {
                        // Verify token
                        const isValid = jsonwebtoken_1.verify(token, environment_1.environment.jwtSecret);
                        // Is is valid proceed
                        if (isValid) {
                            req.body[ServerDefaults_1.ServerDefaults.authUserBodyPropertyName] = jsonwebtoken_1.decode(token);
                            return next();
                        }
                        // Otherwise throw an auth error
                        return new dist_1.ApiResponse({
                            response: res,
                            httpCode: 401,
                            exception: "Invalid token. Unauthorized"
                        }).send();
                    }
                    else {
                        // Token not found, throw an auth error
                        return new dist_1.ApiResponse({
                            response: res,
                            httpCode: 401,
                            exception: "Unauthorized"
                        }).send();
                    }
                }
                catch (ex) {
                    return new dist_1.ApiResponse({
                        response: res,
                        httpCode: 500,
                        exception: ex
                    }).send();
                }
            }));
        }
        return this;
    }
    /**
     * Register this controller routes to the global express application
     */
    register() {
        this.app.use(`/${this.routeName}`, this.router);
        return this;
    }
};
BaseController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.unmanaged()),
    __param(1, inversify_1.unmanaged()),
    __metadata("design:paramtypes", [repositories_1.BaseRepository, Object])
], BaseController);
exports.BaseController = BaseController;
