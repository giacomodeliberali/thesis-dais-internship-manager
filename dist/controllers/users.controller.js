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
const dist_1 = require("gdl-thesis-core/dist");
const base_controller_1 = require("./base/base.controller");
const inversify_1 = require("inversify");
const repositories_1 = require("../repositories");
const di_types_1 = require("../utils/di-types");
/**
 * The [[User]] controller
 */
let UsersController = class UsersController extends base_controller_1.BaseController {
    /**
     * Create the controller that handles routes
     * @param usersRepository The users repository
     * @param app The express application used to register a new route for this controller
     */
    constructor(usersRepository, app) {
        super(usersRepository, app);
        this.usersRepository = usersRepository;
    }
    /**
     * Register this controller routes
     * @param useAllCustom Indicates if the custom routes should be registred automatically [default true]
     */
    register(useAllCustom = true) {
        if (useAllCustom)
            this.useAllCustom();
        return super.register();
    }
    /**
     * Use custom routes
     */
    useAllCustom() {
        return this.useGetByRoles();
    }
    /**
     * Return all users with role matching al least one of the given roles
     */
    useGetByRoles() {
        this.router.post('/getByRoles', (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.usersRepository.getByRoles(req.body.roles)
                .then(result => {
                return new dist_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            });
        }));
        this.router.get('/getByRole/:role', (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.usersRepository.getByRoles(req.params.role)
                .then(result => {
                return new dist_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            });
        }));
        return this;
    }
};
UsersController = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(di_types_1.types.App)),
    __metadata("design:paramtypes", [repositories_1.UsersRepository, Object])
], UsersController);
exports.UsersController = UsersController;
