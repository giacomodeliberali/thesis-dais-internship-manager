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
const dist_1 = require("gdl-thesis-core/dist");
const ServerDefaults_1 = require("../../ServerDefaults");
const api_response_model_1 = require("../../models/api-response.model");
const di_container_1 = require("../di-container");
const repositories_1 = require("../../repositories");
const can_exec_helper_1 = require("./can-exec.helper");
/**
 * Check if the current request has a body property with the decoded JWT information.
 * If this value exists and its 'role' property has value it gets returned, otherwise
 * an auth error will be sent in the response stream.
 *
 * @param request The request
 * @param response The response
 */
function checkBodyUser(request, response) {
    // Pick decoded user
    const user = request.body[ServerDefaults_1.ServerDefaults.authUserBodyPropertyName];
    if (user) {
        if (!user.role)
            return new api_response_model_1.ApiResponse({
                response: response,
                httpCode: 500,
                exception: {
                    message: "The current JWT token contains an invalid user. Try to decode it and verify its content",
                    token: request.headers[ServerDefaults_1.ServerDefaults.jwtTokenHeaderName]
                }
            }).send();
        return user;
    }
    else {
        return new api_response_model_1.ApiResponse({
            response: response,
            httpCode: 500,
            exception: {
                message: "Check that controller.useAuth() has been called before using any scope middleware",
                code: "auth/user-unauthorized"
            }
        }).send();
    }
}
/**
 * Permit execution if and only if current JWT token owner has role.type Admin
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
function adminScope(request, response, next) {
    // Pick decoded user
    const user = checkBodyUser(request, response);
    // Check if has role
    if (user) {
        // Check admin scope
        if ((user.role.type & Number(dist_1.RoleType.Admin)) === Number(dist_1.RoleType.Admin)) {
            return next();
        }
    }
    // Return Unauthorized
    return new api_response_model_1.ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Admin' scope",
            code: "auth/user-unauthorized"
        }
    }).send();
}
exports.adminScope = adminScope;
/**
 * Permit execution if and only if current JWT token owner has role.type Company
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
function companyScope(request, response, next) {
    // Pick decoded user
    const user = checkBodyUser(request, response);
    // Check if has role
    if (user) {
        // Check Company scope
        if ((user.role.type & Number(dist_1.RoleType.Company)) === Number(dist_1.RoleType.Company)) {
            return next();
        }
    }
    // Return Unauthorized
    return new api_response_model_1.ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Company' scope",
            code: "auth/user-unauthorized"
        }
    }).send();
}
exports.companyScope = companyScope;
/**
 * Permit execution if and only if current JWT token owner has role.type Student
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
function studentScope(request, response, next) {
    // Pick decoded user
    const user = checkBodyUser(request, response);
    // Check if has role
    if (user) {
        // Check Student scope
        if ((user.role.type & Number(dist_1.RoleType.Student)) === Number(dist_1.RoleType.Student)) {
            return next();
        }
    }
    // Return Unauthorized
    return new api_response_model_1.ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Student' scope",
            code: "auth/user-unauthorized"
        }
    }).send();
}
exports.studentScope = studentScope;
/**
 * Permit execution if and only if current JWT token owner has role.type Professor
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
function professorScope(request, response, next) {
    // Pick decoded user
    const user = checkBodyUser(request, response);
    // Check if has role
    if (user) {
        // Check Professor scope
        if ((user.role.type & Number(dist_1.RoleType.Professor)) === Number(dist_1.RoleType.Professor)) {
            return next();
        }
    }
    // Return Unauthorized
    return new api_response_model_1.ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Professor' scope",
            code: "auth/user-unauthorized"
        }
    }).send();
}
exports.professorScope = professorScope;
function ownCompany(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Pick decoded user
        const user = checkBodyUser(request, response);
        // Check if has role
        if (user) {
            // If the user is admin, continue
            if ((user.role.type & Number(dist_1.RoleType.Admin)) === Number(dist_1.RoleType.Admin))
                return next();
            try {
                const comapniesRepsoitory = di_container_1.container.resolve(repositories_1.CompaniesRepository);
                const icompany = yield comapniesRepsoitory.get(request.body.id);
                if (icompany) {
                    if ((user.role.type & Number(dist_1.RoleType.Company)) === Number(dist_1.RoleType.Company) && icompany.owners.find(owner => owner.id === user.id)) {
                        return next();
                    }
                }
            }
            catch (ex) {
                // Return Unauthorized
                return new api_response_model_1.ApiResponse({
                    response: response,
                    httpCode: 401,
                    exception: ex
                }).send();
            }
        }
        // Return Unauthorized
        return new api_response_model_1.ApiResponse({
            response: response,
            httpCode: 401,
            exception: {
                message: "Insufficient permission to complete the operation. Missing required 'Admin' scope. Maybe you are trying to update a company of which you are not a owner.",
                code: "auth/user-unauthorized"
            }
        }).send();
    });
}
exports.ownCompany = ownCompany;
function ownInternship(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Pick decoded user
        const user = checkBodyUser(request, response);
        // Check if has role
        if (user) {
            try {
                const internshipsRepsoitory = di_container_1.container.resolve(repositories_1.InternshipsRepository);
                const iinternship = yield internshipsRepsoitory.get(request.body.id);
                if (iinternship) {
                    if ((user.role.type & Number(dist_1.RoleType.Company)) === Number(dist_1.RoleType.Company) && iinternship.company.owners.find(owner => owner.id === user.id)) {
                        return next();
                    }
                }
            }
            catch (ex) {
                // Return Unauthorized
                return new api_response_model_1.ApiResponse({
                    response: response,
                    httpCode: 401,
                    exception: ex
                }).send();
            }
        }
        // Return Unauthorized
        return new api_response_model_1.ApiResponse({
            response: response,
            httpCode: 401,
            exception: {
                message: "Insufficient permission to complete the operation. Maybe you are trying to update an internship of which you are not a owner.",
                code: "auth/user-unauthorized"
            }
        }).send();
    });
}
exports.ownInternship = ownInternship;
function ownInternshipProposal(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Pick decoded user
        const user = checkBodyUser(request, response);
        // Check if has role
        if (user) {
            try {
                const internshipsProposalRepsoitory = di_container_1.container.resolve(repositories_1.InternshipsProposalsRepository);
                const iinternshipProposal = yield internshipsProposalRepsoitory.get(request.body.id);
                if (iinternshipProposal) {
                    // if the current token user is the student or the professor or the company owner of this internship proposal, continue
                    if (iinternshipProposal.student.id === user.id || iinternshipProposal.professor.id === user.id || iinternshipProposal.internship.company.owners.find(o => o.id === user.id)) {
                        return next();
                    }
                }
            }
            catch (ex) {
                // Return Unauthorized
                return new api_response_model_1.ApiResponse({
                    response: response,
                    httpCode: 401,
                    exception: ex
                }).send();
            }
        }
        // Return Unauthorized
        return new api_response_model_1.ApiResponse({
            response: response,
            httpCode: 401,
            exception: {
                message: "Insufficient permission to complete the operation. Maybe you are trying to update an internship proposal of which you are not a member",
                code: "auth/user-unauthorized"
            }
        }).send();
    });
}
exports.ownInternshipProposal = ownInternshipProposal;
function canExecMw(...roles) {
    return __awaiter(this, void 0, void 0, function* () {
        const fun = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            // Pick decoded user
            const user = checkBodyUser(request, response);
            // Check if has role
            if (user) {
                try {
                    if (can_exec_helper_1.canExec(user.role.type, roles)) {
                        return next();
                    }
                }
                catch (ex) {
                    // Return Unauthorized
                    return new api_response_model_1.ApiResponse({
                        response: response,
                        httpCode: 401,
                        exception: ex
                    }).send();
                }
            }
            // Return Unauthorized
            return new api_response_model_1.ApiResponse({
                response: response,
                httpCode: 401,
                exception: {
                    message: `Insufficient permission to complete the operation. Required roles are ${roles.map(r => dist_1.RoleType[r]).join(',')}`,
                    code: "auth/user-unauthorized"
                }
            }).send();
        });
        return fun;
    });
}
exports.canExecMw = canExecMw;
