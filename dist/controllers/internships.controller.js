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
const base_controller_1 = require("./base/base.controller");
const inversify_1 = require("inversify");
const repositories_1 = require("../repositories");
const di_types_1 = require("../utils/di-types");
const api_response_model_1 = require("../models/api-response.model");
/**
 * The [[Internship]] controller
 */
let InternshipsController = class InternshipsController extends base_controller_1.BaseController {
    /**
     * Create the controller that handles routes
     * @param internshipsRepository The companies repository
     * @param app The express application used to register a new route for this controller
     */
    constructor(internshipsRepository, app) {
        super(internshipsRepository, app);
        this.internshipsRepository = internshipsRepository;
    }
    useGetByCompanyOwnerId() {
        this.router.get('/getByCompanyOwnerId/:ownerId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const ownerId = req.params.ownerId;
            if (ownerId) {
                // The user to update is the same as token
                return this.internshipsRepository.getByCompanyOwnerId(ownerId)
                    .then(result => {
                    return new api_response_model_1.ApiResponse({
                        data: result,
                        httpCode: 200,
                        response: res
                    }).send();
                });
            }
            else {
                return new api_response_model_1.ApiResponse({
                    exception: {
                        message: "Missing required parameter 'ownerId'",
                        code: "request/bad-params"
                    },
                    httpCode: 400,
                    response: res
                }).send();
            }
        }));
        return this;
    }
};
InternshipsController = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(di_types_1.types.App)),
    __metadata("design:paramtypes", [repositories_1.InternshipsRepository, Object])
], InternshipsController);
exports.InternshipsController = InternshipsController;
