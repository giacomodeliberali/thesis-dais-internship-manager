"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const base_1 = require("../models/entities/base");
class AuthService {
    constructor() {
        this.user = new models_1.User({
            role: new base_1.Role({
                name: "admin",
                type: models_1.RoleType.Admin
            })
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map