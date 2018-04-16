"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("gdl-thesis-core/dist");
const ServerDefaults_1 = require("../../ServerDefaults");
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
                message: "Check that controller.useAuth() has been called before using any scope middleware"
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
            message: "Missing required 'Admin' scope"
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
            message: "Missing required 'Company' scope"
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
            message: "Missing required 'Student' scope"
        }
    }).send();
}
exports.studentScope = studentScope;
/**
 * Permit execution if and only if current JWT token owner has role.type Tutor
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
function tutorScope(request, response, next) {
    // Pick decoded user
    const user = checkBodyUser(request, response);
    // Check if has role
    if (user) {
        // Check Tutor scope
        if ((user.role.type & Number(dist_1.RoleType.Tutor)) === Number(dist_1.RoleType.Tutor)) {
            return next();
        }
    }
    // Return Unauthorized
    return new dist_1.ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Missing required 'Tutor' scope"
        }
    }).send();
}
exports.tutorScope = tutorScope;
