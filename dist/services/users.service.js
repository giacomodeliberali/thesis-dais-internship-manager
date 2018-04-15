"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const models_1 = require("../models");
class UsersService extends base_1.BaseService {
    constructor(db) {
        super(db, new models_1.User().collectionName);
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map