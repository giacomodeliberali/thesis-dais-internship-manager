"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("gdl-thesis-core/dist");
const ServerDefaults_1 = require("../../ServerDefaults");
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
            return new dist_1.ApiResponse({
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
        return new dist_1.ApiResponse({
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
    return new dist_1.ApiResponse({
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
    return new dist_1.ApiResponse({
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
    return new dist_1.ApiResponse({
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
    return new dist_1.ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Professor' scope",
            code: "auth/user-unauthorized"
        }
    }).send();
}
exports.professorScope = professorScope;
