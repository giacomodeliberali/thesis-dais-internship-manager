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
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
let BaseRepository = class BaseRepository {
    /**
     * Initialize the base repository
     * @param model The mongoose model for this repository
     * @param collectionName The collection name, used also as controller route name
     */
    constructor(model, collectionName) {
        this.model = model;
        this.collectionName = collectionName;
    }
    /**
     * Return the ObjectID or throw an exception if invalid
     * @param objectId The string ObjectID
     */
    getObjectId(objectId) {
        try {
            return new mongodb_1.ObjectID(objectId);
        }
        catch (ex) {
            throw new Error("Invalid ObjectID");
        }
    }
    /**
     * Creates a new item
     * @param item The item to create
     */
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(item).then(result => {
                if (result && result._id)
                    return this.model.findById(result._id);
                return null;
            });
        });
    }
    /**
     * Create or update an element
     * @param element The element to create or update
     */
    update(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item.id)
                return this.create(item);
            return this.model.findByIdAndUpdate(item.id, item)
                .then(result => {
                return this.get(item.id);
            });
        });
    }
    /**
     * Update only the specified property of the item
     * @param item The item to update
     */
    partialUpdate(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(id, { $set: item })
                .then(result => {
                return this.get(id);
            });
        });
    }
    /**
     * Delete an existing element
     * @param id The element identifier
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndRemove(id)
                .then(res => !!res)
                .catch(ex => false);
        });
    }
    /**
     * Return the item with specified id if exists, null otherwise.
     * @param id The item identifier (id property of [[BaseEntity]])
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id);
        });
    }
    /**
     * Return all elements matching the specified query
     *
     * @param {RepositoryQuery<Dto>} [query] The query. If not specified return the collection elements
     */
    find(query) {
        return this.model.find(query || {});
    }
    /**
     * Return a the first element matching the specified query
     * @param query The query. If not specified return the first collection element
     */
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(query);
        });
    }
};
BaseRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.unmanaged()),
    __param(1, inversify_1.unmanaged()),
    __metadata("design:paramtypes", [mongoose_1.Model, String])
], BaseRepository);
exports.BaseRepository = BaseRepository;
