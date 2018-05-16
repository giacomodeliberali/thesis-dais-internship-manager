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
const dist_1 = require("gdl-thesis-core/dist");
/**
 * The [[InternshipProposal]] controller
 */
let InternshipProposalsController = class InternshipProposalsController extends base_controller_1.BaseController {
    /**
     * Create the controller that handles routes
     * @param internshipProposalsRepository The companies repository
     * @param app The express application used to register a new route for this controller
     */
    constructor(internshipProposalsRepository, app) {
        super(internshipProposalsRepository, app);
        this.internshipProposalsRepository = internshipProposalsRepository;
    }
    useCustoms() {
        return this
            .useGetPendingStudents()
            .useGetAvailablePlaces();
    }
    /**
     * Return the list of [[InternshipProposal]] waiting for a response from the given professor id
     */
    useGetPendingStudents() {
        this.router.get('/pendingstudents/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const professorId = req.params.id;
            const proposals = yield this.internshipProposalsRepository.find({
                professor: professorId,
                status: dist_1.InternshipProposalStatusType.WaitingForProfessor
            });
            if (professorId) {
                return new api_response_model_1.ApiResponse({
                    data: proposals,
                    httpCode: 200,
                    response: res
                }).send();
            }
            else {
                return new api_response_model_1.ApiResponse({
                    exception: {
                        message: "Bad request. Missing 'id' parameter"
                    },
                    httpCode: 400,
                    response: res
                }).send();
            }
        }));
        return this;
    }
    /**
     * Return the number of available place in an [[Internship]]
     */
    useGetAvailablePlaces() {
        this.router.get('/availableplaces/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const internshipId = req.params.id;
            const count = yield this.internshipProposalsRepository.getAvailablePlaces(internshipId);
            if (internshipId) {
                return new api_response_model_1.ApiResponse({
                    data: count,
                    httpCode: 200,
                    response: res
                }).send();
            }
            else {
                return new api_response_model_1.ApiResponse({
                    exception: {
                        message: "Bad request. Missing 'id' parameter"
                    },
                    httpCode: 400,
                    response: res
                }).send();
            }
        }));
        return this;
    }
};
InternshipProposalsController = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(di_types_1.types.App)),
    __metadata("design:paramtypes", [repositories_1.InternshipsProposalsRepository, Object])
], InternshipProposalsController);
exports.InternshipProposalsController = InternshipProposalsController;
