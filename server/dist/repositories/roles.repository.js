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
const base_1 = require("./base");
const thesis_dais_internship_manager_core_1 = require("thesis-dais-internship-manager-core");
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const di_types_1 = require("../utils/di-types");
/**
 * The [[Role]] repository
 */
let RolesRepository = class RolesRepository extends base_1.BaseRepository {
    /**
     * Initialize [[RolesRepository]]
     * @param roleModel The injected [[RoleSchema]] model
     */
    constructor(roleModel) {
        // Initialize [[BaseRepository]] 
        super(roleModel, thesis_dais_internship_manager_core_1.Defaults.collectionsName.roles);
        this.roleModel = roleModel;
    }
    /**
     * Gets or create a role. Reject with an error if the operation fails
     * @param type The role type
     * @param name The role name
     */
    getOrCreateOne(type, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.findOne({ type: type });
            if (role)
                return role;
            console.log(`[RolesRepository] getOrCreateOne => Cannot find a valid role entry with type '${type}', creating a new one...`);
            try {
                role = yield this.update({
                    type: type,
                    name: name
                });
                return role;
            }
            catch (ex) {
                return Promise.reject({
                    message: "Cannot get or create a valid role entry for 'Company'",
                    error: ex
                });
            }
        });
    }
};
RolesRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(di_types_1.types.Models.Role)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], RolesRepository);
exports.RolesRepository = RolesRepository;
