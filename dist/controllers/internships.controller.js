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
const internship_status_type_machine_1 = require("../utils/state-machines/internship-status.type.machine");
const dist_1 = require("gdl-thesis-core/dist");
const scopes_1 = require("../utils/auth/scopes");
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
    useCustoms() {
        return this
            .useGetApproved()
            .useGetNotApproved()
            .useGetByCompanyOwnerId()
            .useListStates()
            .useUpdateStates()
            .useForceUpdateStates();
    }
    /**
       * Return the list of all internships inserted by companies
       * in which owners contain the given ownerId
     */
    useGetByCompanyOwnerId() {
        this.router.get('/getByCompanyOwnerId/:ownerId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const ownerId = req.params.ownerId;
            if (ownerId) {
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
    /**
     * Return all the Approved internships
     */
    useGetApproved() {
        this.router.get('/getApproved', (req, res) => __awaiter(this, void 0, void 0, function* () {
            return this.internshipsRepository.getApproved()
                .then(result => {
                return new api_response_model_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            });
        }));
        return this;
    }
    /**
     * Return all the NotApproved internships
     */
    useGetNotApproved() {
        this.router.get('/getNotApproved', (req, res) => __awaiter(this, void 0, void 0, function* () {
            return this.internshipsRepository.getNotApproved()
                .then(result => {
                return new api_response_model_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            });
        }));
        return this;
    }
    /**
     * Update the state of an [[Internship]] following the [[InternshipStatusTypeMachine]] transition function
     */
    useUpdateStates() {
        this.router.put('/status', [scopes_1.professorScope], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const internshipId = req.body.id;
            const newState = req.body.status;
            const rejectReason = req.body.rejectReason;
            if (newState === undefined && newState === null) {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 400,
                    response: res,
                    exception: {
                        message: "Bad request. Request body is empty, missing 'status' parameter"
                    }
                }).send();
            }
            // Get the internship
            const internship = yield this.internshipsRepository.get(internshipId);
            if (!internship) {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 404,
                    response: res,
                    exception: {
                        message: `Cannot find a internship matching the id '${internshipId}'`
                    }
                }).send();
            }
            // Check the state transition
            const stateMachine = new internship_status_type_machine_1.InternshipStatusTypeMachine(internship.status);
            if (!stateMachine.can(newState)) {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 400,
                    response: res,
                    exception: {
                        message: `Cannot update the internship status from ${dist_1.InternshipStatusType[internship.status]} to ${dist_1.InternshipStatusType[newState]}`
                    }
                }).send();
            }
            const update = new dist_1.Internship(internship.toObject());
            update.status = newState;
            return this.internshipsRepository
                .partialUpdate({
                status: newState,
                id: update.id,
                rejectReason: rejectReason
            })
                .then(result => {
                return new api_response_model_1.ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();
            });
        }));
        return this;
    }
    /**
     * Update the state of an [[Internship]] WITHOUT the constraint of the [[InternshipStatusTypeMachine]] transition function
     */
    useForceUpdateStates() {
        this.router.put('/status/force', [scopes_1.adminScope], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newState = req.body.status;
            const id = req.body.id;
            if (newState !== undefined && newState !== null) {
                return this.internshipsRepository
                    .partialUpdate({
                    status: newState,
                    id: id
                })
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
                    data: null,
                    httpCode: 400,
                    response: res,
                    exception: {
                        message: "Bad request. Request body is empty, missing 'status' parameter"
                    }
                }).send();
            }
        }));
        return this;
    }
    /**
     * Given a [[InternshipsStatusType]] return all the available states
     */
    useListStates() {
        this.router.get('/status/:state', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentState = req.params.state;
            if (currentState !== undefined && currentState !== null) {
                const stateMachine = new internship_status_type_machine_1.InternshipStatusTypeMachine(currentState);
                return new api_response_model_1.ApiResponse({
                    data: stateMachine.getAvailableStates(),
                    httpCode: 200,
                    response: res
                }).send();
            }
            else {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 400,
                    response: res,
                    exception: {
                        message: "Bad request. Request body is empty, missing 'status' parameter"
                    }
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
//# sourceMappingURL=internships.controller.js.map