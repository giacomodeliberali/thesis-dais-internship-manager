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
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const dist_1 = require("gdl-thesis-core/dist");
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const di_types_1 = require("../utils/di-types");
/**
 * The [[Internship]] repository
 */
let InternshipsRepository = class InternshipsRepository extends base_1.BaseRepository {
    /**
     * Initialize [[InternshipsRepository]]
     * @param internshipsModel The injected [[InternshipModel]] model
     */
    constructor(internshipsModel) {
        // Initialize [[BaseRepository]] 
        super(internshipsModel, dist_1.Defaults.collectionsName.internships);
        this.internshipsModel = internshipsModel;
    }
};
InternshipsRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(di_types_1.types.Models.InternShip)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], InternshipsRepository);
exports.InternshipsRepository = InternshipsRepository;
