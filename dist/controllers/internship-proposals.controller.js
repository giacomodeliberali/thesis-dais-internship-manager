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
const scopes_1 = require("../utils/auth/scopes");
const internship_proposal_status_type_machine_1 = require("../utils/state-machines/internship-proposal-status.type.machine");
const ServerDefaults_1 = require("../ServerDefaults");
const internship_proposal_template_1 = require("../utils/pdf-generation/internship-proposal.template");
const pdf_generator_util_1 = require("../utils/pdf-generation/pdf-generator.util");
/**
 * The [[InternshipProposal]] controller
 */
let InternshipProposalsController = class InternshipProposalsController extends base_controller_1.BaseController {
    /**
     * Create the controller that handles routes
     * @param internshipProposalsRepository The companies repository
     * @param app The express application used to register a new route for this controller
     */
    constructor(internshipProposalsRepository, app, companiesRepository, internshipsRepository) {
        super(internshipProposalsRepository, app);
        this.internshipProposalsRepository = internshipProposalsRepository;
        this.companiesRepository = companiesRepository;
        this.internshipsRepository = internshipsRepository;
    }
    useCustoms() {
        return this
            .useGetByProfessorId()
            .useGetAvailablePlaces()
            .useGetByStudentId()
            .useGetByCompanyOwnerId()
            .useUpdateStates()
            .useForceUpdateStates()
            .useListStates()
            .useAddAttendance()
            .useGenerateDocs();
    }
    /**
     * Return the list of [[InternshipProposal]] that reference the given professor id
     */
    useGetByProfessorId() {
        this.router.get('/getByProfessorId/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const professorId = req.params.id;
            const proposals = yield this.internshipProposalsRepository.find({
                professor: professorId
            }).sort([['status', 'ascending']]);
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
     * Return the list of [[InternshipProposal]] that reference at least one company of the given user id
     */
    useGetByCompanyOwnerId() {
        this.router.get('/getByCompanyOwnerId/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const companyOwnerId = req.params.id;
                if (!companyOwnerId)
                    return new api_response_model_1.ApiResponse({
                        exception: {
                            message: "Bad request. Missing 'id' parameter"
                        },
                        httpCode: 400,
                        response: res
                    }).send();
                // Get all companies of the given user id
                const companies = yield this.companiesRepository.getByOwnerId(companyOwnerId);
                // Get all proposals 
                // TODO: make a nested query with populate, but how?
                let proposals = yield this.internshipProposalsRepository.find();
                // Filter only proposals in which the company id is one of the above
                proposals = proposals.filter(p => {
                    const companiesIds = companies.map(c => c.id);
                    return !!companiesIds.find(c => c === p.internship.company.id);
                });
                return new api_response_model_1.ApiResponse({
                    data: proposals,
                    httpCode: 200,
                    response: res
                }).send();
            }
            catch (ex) {
                return new api_response_model_1.ApiResponse({
                    exception: ex,
                    httpCode: 500,
                    response: res
                }).send();
            }
        }));
        return this;
    }
    /**
     * Return the list of [[InternshipProposal]] created by the given student id
     */
    useGetByStudentId() {
        this.router.get('/getByStudentId/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.params.id;
            const proposals = yield this.internshipProposalsRepository.find({
                student: studentId
            });
            if (studentId) {
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
    /**
     * Update the state of an [[Internship]] following the [[InternshipStatusTypeMachine]] transition function
     */
    useUpdateStates() {
        this.router.put('/status', [scopes_1.ownInternshipProposal], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const internshipProposalId = req.body.id;
            const newState = req.body.status;
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
            const internshipProposal = yield this.internshipProposalsRepository.get(internshipProposalId);
            if (!internshipProposal) {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 404,
                    response: res,
                    exception: {
                        message: `Cannot find a internship matching the id '${internshipProposalId}'`
                    }
                }).send();
            }
            // Check the state transition
            const stateMachine = new internship_proposal_status_type_machine_1.InternshipProposalStatusTypeMachine(internshipProposal.status);
            if (!stateMachine.can(newState)) {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 400,
                    response: res,
                    exception: {
                        message: `Cannot update the internship status from ${dist_1.InternshipProposalStatusType[internshipProposal.status]} to ${dist_1.InternshipProposalStatusType[newState]}`
                    }
                }).send();
            }
            // Update the proposal
            const update = new dist_1.InternshipProposal(internshipProposal.toObject());
            update.status = newState;
            // Set startDate once started
            if (newState === dist_1.InternshipProposalStatusType.Started)
                update.startDate = new Date();
            // Set end date once Ended,Canceled or rejected
            if (newState === dist_1.InternshipProposalStatusType.Ended ||
                newState === dist_1.InternshipProposalStatusType.Canceled ||
                newState === dist_1.InternshipProposalStatusType.RejectedByCompany ||
                newState === dist_1.InternshipProposalStatusType.RejectedByProfessor)
                update.endDate = new Date();
            const result = yield this.internshipProposalsRepository
                .partialUpdate(update.id, {
                status: newState,
                startDate: update.startDate,
                endDate: update.endDate
            });
            // Check remaining places for the related internship
            const availablePlaces = yield this.internshipProposalsRepository.getAvailablePlaces(update.internship.id);
            // If no more free spaces change the internship status to Closed
            if (availablePlaces === 0)
                yield this.internshipsRepository
                    .partialUpdate(update.internship.id, {
                    status: dist_1.InternshipStatusType.Closed
                });
            // Return the updated internship proposal
            return new api_response_model_1.ApiResponse({
                data: result,
                httpCode: 200,
                response: res
            }).send();
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
                // Update the proposal
                const result = yield this.internshipProposalsRepository
                    .partialUpdate(id, {
                    status: newState
                });
                // Check remaining places for the related internship
                const internshipProposal = yield this.internshipProposalsRepository.get(id);
                const availablePlaces = yield this.internshipProposalsRepository.getAvailablePlaces(internshipProposal.internship.id);
                // If no more free spaces change the internship status to Closed
                if (availablePlaces === 0)
                    yield this.internshipsRepository
                        .partialUpdate(internshipProposal.internship.id, {
                        status: dist_1.InternshipStatusType.Closed
                    });
                // Return the updated internship proposal
                return new api_response_model_1.ApiResponse({
                    data: result,
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
    /**
     * Given a [[InternshipsStatusType]] return all the available states
     */
    useListStates() {
        this.router.get('/status/:state', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentState = req.params.state;
            if (currentState !== undefined && currentState !== null) {
                const stateMachine = new internship_proposal_status_type_machine_1.InternshipProposalStatusTypeMachine(currentState);
                const user = req.body[ServerDefaults_1.ServerDefaults.authUserBodyPropertyName];
                return new api_response_model_1.ApiResponse({
                    data: stateMachine.getAvailableStates(user.role.type),
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
    /**
     * Add a list of attendances to a internship proposal
     *
     * ***POST***
     *
     * /internshipProposals/addAttendances
     *
     * ***Body parameters***
     * ```
     * {
     *    attendances: Array<Attendance>,
     *    internshipProposalId: string
     * }```
     *
     * @return ApiResponse<InternshipProposal>
     */
    useAddAttendance() {
        this.router.post('/addAttendances', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const attendances = req.body.attendances;
                const internshipProposalId = req.body.internshipProposalId;
                if (!attendances) {
                    return new api_response_model_1.ApiResponse({
                        data: null,
                        httpCode: 400,
                        response: res,
                        exception: {
                            message: "Bad request. Request body is empty, missing 'status' parameter"
                        }
                    }).send();
                }
                //  Get proposal
                const proposal = yield this.internshipProposalsRepository.get(internshipProposalId);
                // Get user
                const user = req.body[ServerDefaults_1.ServerDefaults.authUserBodyPropertyName];
                // Check if the user is related to the internship proposal
                // The user is the student
                if (proposal.student.id !== user.id &&
                    // or the professor
                    proposal.professor.id !== user.id &&
                    // or the company owner
                    !proposal.internship.company.owners.find(o => o.id === user.id)) {
                    return new api_response_model_1.ApiResponse({
                        data: null,
                        httpCode: 401,
                        response: res,
                        exception: {
                            code: "auth/user-unauthorized",
                            message: "You cannot add an attendance of an internship proposal you are not in"
                        }
                    }).send();
                }
                // Ok, push and update
                proposal.attendances = proposal.attendances || [];
                proposal.attendances.push(...attendances);
                return new api_response_model_1.ApiResponse({
                    data: yield proposal.save(),
                    httpCode: 200,
                    response: res
                }).send();
            }
            catch (ex) {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 500,
                    response: res,
                    exception: ex
                }).send();
            }
        }));
        return this;
    }
    /**
     * Create the documentation at the end of an InternshipProposal
     *
     * ***GET***
     *
     * /internshipProposals/generateDocs/${internshipProposalId}
     *
     * ***Query parameters***
     * ```
     * {
     *    internshipProposalId: string
     * }```
     *
     * @return PDF Stream
     */
    useGenerateDocs() {
        this.router.get('/generateDocs/:internshipProposalId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const internshipProposalId = req.params.internshipProposalId;
                if (!internshipProposalId) {
                    return new api_response_model_1.ApiResponse({
                        data: null,
                        httpCode: 400,
                        response: res,
                        exception: {
                            message: "Bad request. Missing 'internshipProposalId' parameter"
                        }
                    }).send();
                }
                //  Get proposal
                const proposal = yield this.internshipProposalsRepository.get(internshipProposalId);
                // Get user
                const user = req.body[ServerDefaults_1.ServerDefaults.authUserBodyPropertyName];
                // Check if the user is related to the internship proposal
                // The user is the student
                if (proposal.student.id !== user.id &&
                    // or the professor
                    proposal.professor.id !== user.id &&
                    // or the company owner
                    !proposal.internship.company.owners.find(o => o.id === user.id)) {
                    return new api_response_model_1.ApiResponse({
                        data: null,
                        httpCode: 401,
                        response: res,
                        exception: {
                            code: "auth/user-unauthorized",
                            message: "You cannot generate documentation of an internship proposal you are not in"
                        }
                    }).send();
                }
                pdf_generator_util_1.PdfGenerator.generateAndSend(internship_proposal_template_1.generateInternshipProposalTemplate(proposal), res);
            }
            catch (ex) {
                return new api_response_model_1.ApiResponse({
                    data: null,
                    httpCode: 500,
                    response: res,
                    exception: ex
                }).send();
            }
        }));
        return this;
    }
};
InternshipProposalsController = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(di_types_1.types.App)),
    __metadata("design:paramtypes", [repositories_1.InternshipsProposalsRepository, Object, repositories_1.CompaniesRepository,
        repositories_1.InternshipsRepository])
], InternshipProposalsController);
exports.InternshipProposalsController = InternshipProposalsController;
