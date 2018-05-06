import { Response, Request } from "express";
import { User, RoleType, Company, Internship } from "gdl-thesis-core/dist";
import { ServerDefaults } from "../../ServerDefaults";
import { ApiResponse } from "../../models/api-response.model";
import { container } from "../di-container";
import { CompaniesController } from "../../controllers/companies.controller";
import { CompaniesRepository, InternshipsRepository } from "../../repositories";
import { IInternship } from "../../models/interfaces";

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
                message: "Check that controller.useAuth() has been called before using any scope middleware",
                code: "auth/user-unauthorized"
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
            message: "Insufficient permission to complete the operation. Missing required 'Admin' scope",
            code: "auth/user-unauthorized"
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
            message: "Insufficient permission to complete the operation. Missing required 'Company' scope",
            code: "auth/user-unauthorized"
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
            message: "Insufficient permission to complete the operation. Missing required 'Student' scope",
            code: "auth/user-unauthorized"
        } as any
    }).send();
}

/**
 * Permit execution if and only if current JWT token owner has role.type Professor
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
export function professorScope(request: Request, response: Response, next: Function) {

    // Pick decoded user
    const user = checkBodyUser(request, response);

    // Check if has role
    if (user) {
        // Check Professor scope
        if ((user.role.type & Number(RoleType.Professor)) === Number(RoleType.Professor)) {
            return next();
        }
    }

    // Return Unauthorized
    return new ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Professor' scope",
            code: "auth/user-unauthorized"
        } as any
    }).send();
}

export async function ownCompany(request: Request, response: Response, next: Function) {

    // Pick decoded user
    const user = checkBodyUser(request, response);

    // Check if has role
    if (user) {

        // If the user is admin, continue
        if ((user.role.type & Number(RoleType.Admin)) === Number(RoleType.Admin))
            return next();

        try {
            const comapniesRepsoitory = container.resolve(CompaniesRepository);
            const icompany = await comapniesRepsoitory.get(request.body.id);
            if (icompany) {
                if ((user.role.type & Number(RoleType.Company)) === Number(RoleType.Company) && icompany.owners.find(owner => owner.id === user.id)) {
                    return next();
                }
            }
        } catch (ex) {
            // Return Unauthorized
            return new ApiResponse({
                response: response,
                httpCode: 401,
                exception: ex
            }).send();
        }
    }

    // Return Unauthorized
    return new ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Admin' scope. Maybe you are trying to update a company of which you are not a owner.",
            code: "auth/user-unauthorized"
        } as any
    }).send();
}

export async function ownInternship(request: Request, response: Response, next: Function) {

    // Pick decoded user
    const user = checkBodyUser(request, response);

    // Check if has role
    if (user) {

        // If the user is admin, continue
        if ((user.role.type & Number(RoleType.Admin)) === Number(RoleType.Admin))
            return next();

        try {

            const internshipsRepsoitory = container.resolve(InternshipsRepository);

            const iinternship = await internshipsRepsoitory.get(request.body.id);
            if (iinternship) {
                if ((user.role.type & Number(RoleType.Company)) === Number(RoleType.Company) && iinternship.company.owners.find((owner: any) => owner === user.id)) {
                    return next();
                }
            }
        } catch (ex) {
            // Return Unauthorized
            return new ApiResponse({
                response: response,
                httpCode: 401,
                exception: ex
            }).send();
        }
    }

    // Return Unauthorized
    return new ApiResponse({
        response: response,
        httpCode: 401,
        exception: {
            message: "Insufficient permission to complete the operation. Missing required 'Admin' scope. Maybe you are trying to update an internship of which you are not a owner.",
            code: "auth/user-unauthorized"
        } as any
    }).send();
}