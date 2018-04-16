import { Response, Request } from "express";
import { ApiResponse, User, RoleType } from "gdl-thesis-core/dist";
import { ServerDefaults } from "../../ServerDefaults";

/**
 * Check if the current request has a body property with the decoded JWT information.
 * If this value exists and its 'role' property has value it gets returned, otherwise
 * an auth error will be sent in the response stream.
 * 
 * @param request The request
 * @param response The response
 */
function checkBodyUser(request: Request, response: Response): User {
    // Pick decoded user
    const user: User = request.body[ServerDefaults.authUserBodyPropertyName];

    if (user) {
        if (!user.role)
            return new ApiResponse({
                response: response,
                httpCode: 500,
                exception: {
                    message: "The current JWT token contains an invalid user. Try to decode it and verify its content",
                    token: request.headers[ServerDefaults.jwtTokenHeaderName]
                }
            }).send() as any;

        return user;
    } else {
        return new ApiResponse({
            response: response,
            httpCode: 500,
            exception: {
                message: "Check that controller.useAuth() has been called before using any scope middleware"
            }
        }).send() as any;
    }
}

/**
 * Permit execution if and only if current JWT token owner has role.type Admin
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
export function adminScope(request: Request, response: Response, next: Function) {

    // Pick decoded user
    const user = checkBodyUser(request, response);

    // Check if has role
    if (user) {
        // Check admin scope
        if ((user.role.type & Number(RoleType.Admin)) === Number(RoleType.Admin)) {
            return next();
        }
    }

    // Return Unauthorized
    return new ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Missing required 'Admin' scope"
        } as any
    }).send();
}

/**
 * Permit execution if and only if current JWT token owner has role.type Company
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
export function companyScope(request: Request, response: Response, next: Function) {

    // Pick decoded user
    const user = checkBodyUser(request, response);

    // Check if has role
    if (user) {
        // Check Company scope
        if ((user.role.type & Number(RoleType.Company)) === Number(RoleType.Company)) {
            return next();
        }
    }

    // Return Unauthorized
    return new ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Missing required 'Company' scope"
        } as any
    }).send();
}

/**
 * Permit execution if and only if current JWT token owner has role.type Student
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
export function studentScope(request: Request, response: Response, next: Function) {

    // Pick decoded user
    const user = checkBodyUser(request, response);

    // Check if has role
    if (user) {
        // Check Student scope
        if ((user.role.type & Number(RoleType.Student)) === Number(RoleType.Student)) {
            return next();
        }
    }

    // Return Unauthorized
    return new ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Missing required 'Student' scope"
        } as any
    }).send();
}

/**
 * Permit execution if and only if current JWT token owner has role.type Tutor
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
export function tutorScope(request: Request, response: Response, next: Function) {

    // Pick decoded user
    const user = checkBodyUser(request, response);

    // Check if has role
    if (user) {
        // Check Tutor scope
        if ((user.role.type & Number(RoleType.Tutor)) === Number(RoleType.Tutor)) {
            return next();
        }
    }

    // Return Unauthorized
    return new ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Missing required 'Tutor' scope"
        } as any
    }).send();
}