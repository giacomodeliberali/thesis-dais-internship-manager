"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../models/entities/base");
const mongodb_1 = require("mongodb");
class BaseService {
    /**
     * Initialize the base repository
     * @param db The mongodb database instance
     * @param collectionName The current collection name
     */
    constructor(db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
        this._collection = db.collection(collectionName);
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
            const result = yield this._collection.insertOne(item);
            return new base_1.ServiceResponse({
                isOk: !!result.result.ok,
                objectId: result.insertedId.toHexString()
            });
        });
    }
    /**
     * Create or update an element
     * @param element The element to create or update
     */
    update(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!item._id)
                return this.create(item);
            const result = yield this._collection.updateOne({
                _id: this.getObjectId(item._id)
            }, item);
            return new base_1.ServiceResponse({
                isOk: !!result.result.ok,
                objectId: result.upsertedId._id.toHexString()
            });
        });
    }
    /**
     * Delete an existing element
     * @param id The element identifier
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._collection.deleteOne({
                _id: this.getObjectId(id)
            });
            return !!result.result.ok;
        });
    }
    /**
     * Return the item with specified id if exists, null otherwise.
     * @param id The item identifier (id property of [[BaseEntity]])
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._collection.find({
                _id: this.getObjectId(id)
            }).toArray();
            if (result && result.length > 0)
                return result[0];
            return null;
        });
    }
    /**
     * Return all elements matching the specified query
     * @param query The query. If not specified return the collection elements
     */
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._collection.find(query || {}).toArray();
        });
    }
    /**
     * Return a the first element matching the specified query
     * @param query The query. If not specified return the first collection element
     */
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._collection.find(query).toArray();
            if (result && result.length > 0)
                return result[0];
            return null;
        });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map