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
const dist_1 = require("gdl-thesis-core/dist");
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const di_types_1 = require("../utils/di-types");
const _1 = require(".");
/**
 * The [[InternshipsProposalsRepository]] repository
 */
let InternshipsProposalsRepository = class InternshipsProposalsRepository extends base_1.BaseRepository {
    /**
     * Initialize [[UsersRepository]]
     * @param internshipProposalModel The injected [[InternshipProposalModel]] model
     */
    constructor(internshipProposalModel, internshipRepository) {
        // Initialize [[BaseRepository]] 
        super(internshipProposalModel, dist_1.Defaults.collectionsName.internshipProposals);
        this.internshipProposalModel = internshipProposalModel;
        this.internshipRepository = internshipRepository;
    }
    /**
     * Return the number of available places for an internship
     * @param internshipId The internship id
     */
    getAvailablePlaces(internshipId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposals = yield this.find({
                internship: internshipId,
                status: dist_1.InternshipProposalStatusType.Confirmed
            });
            const internship = yield this.internshipRepository.get(internshipId);
            if (proposals && internship)
                return internship.studentsNumber - proposals.length;
            if (internship)
                return internship.studentsNumber;
            return 0;
        });
    }
};
InternshipsProposalsRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(di_types_1.types.Models.InternShipProposal)),
    __param(1, inversify_1.inject(new inversify_1.LazyServiceIdentifer(() => _1.InternshipsRepository))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        _1.InternshipsRepository])
], InternshipsProposalsRepository);
exports.InternshipsProposalsRepository = InternshipsProposalsRepository;
