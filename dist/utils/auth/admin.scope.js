"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("gdl-thesis-core/dist");
/**
 * Permit execution if and only if current JWT token owner has role.type Admin
 * @param request The request with the populated body.__user
 * @param response The response stream
 * @param next The next middleware function
 */
function adminScope(request, response, next) {
    // Pick decoded user
    const user = request.body.__user;
    // Check if has role
    if (user && user.role) {
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
            message: "Missing required 'admin' scope"
        }
    }).send();
}
exports.adminScope = adminScope;
