"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../services/auth.service");
const service_locator_service_1 = require("../services/service-locator.service");
const models_1 = require("../models");
function authenticated(target, propertyKey, descriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const authService = service_locator_service_1.ServiceLocator.resolve(auth_service_1.AuthService);
        console.log(authService.user);
        if ((authService.user.role.type & models_1.RoleType.Admin) != models_1.RoleType.Admin)
            throw new Error("Permission denied");
        return originalMethod.apply(this, args);
    };
}
exports.authenticated = authenticated;
//# sourceMappingURL=auth.decorator.js.map