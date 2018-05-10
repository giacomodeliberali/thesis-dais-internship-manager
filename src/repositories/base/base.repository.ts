import { Defaults, BaseEntity } from "gdl-thesis-core/dist";
import { Collection, Db, ObjectID } from "mongodb";
import { injectable, inject, unmanaged } from "inversify";
import { Model, SchemaType } from "mongoose";
import { IBaseEntity, RepositoryQuery } from "../../models/interfaces";

@injectable()
export class BaseRepository<MongooseDocumentOfDto extends IBaseEntity & Dto = any, Dto extends BaseEntity<Dto> = any> {

    /** The collection name, used also as controller route name */
    public collectionName: string;

    /** The mongoose model for this repository */
    protected model: Model<MongooseDocumentOfDto>;

    /**
     * Initialize the base repository
     * @param model The mongoose model for this repository
     * @param collectionName The collection name, used also as controller route name
     */
    constructor(
        @unmanaged() model: Model<MongooseDocumentOfDto>,
        @unmanaged() collectionName: string) {

        this.model = model;
        this.collectionName = collectionName;
    }

    /**
     * Return the ObjectID or throw an exception if invalid
     * @param objectId The string ObjectID
     */
    private getObjectId(objectId: string) {
        try {
            return new ObjectID(objectId);
        } catch (ex) {
            throw new Error("Invalid ObjectID");
        }
    }

    /**
     * Creates a new item
     * @param item The item to create
     */
    async create(item: Dto): Promise<MongooseDocumentOfDto> {
        return this.model.create(item).then(result => {
            if (result && result._id)
                return this.model.findById(result._id);

            return null;
        });
    }

    /**
     * Create or update an element
     * @param element The element to create or update
     */
    async update(item: Dto): Promise<MongooseDocumentOfDto> {
        if (!item.id)
            return this.create(item);

        return this.model.findByIdAndUpdate(item.id, item)
            .then(result => {
                return this.get(item.id);
            });
    }

    /**
     * Update only the specified property of the item
     * @param item The item to update
     */
    async partialUpdate(item: Partial<Dto>): Promise<MongooseDocumentOfDto> {
        return this.model.findByIdAndUpdate(item.id, { $set: item })
            .then(result => {
                return this.get(item.id);
            });
    }

    /**
     * Delete an existing element
     * @param id The element identifier
     */
    async delete(id: string): Promise<boolean> {
        return this.model.findByIdAndRemove(id)
            .then(res => !!res)
            .catch(ex => false);
    }

    /**
     * Return the item with specified id if exists, null otherwise.
     * @param id The item identifier (id property of [[BaseEntity]])
     */
    async get(id: string): Promise<MongooseDocumentOfDto> {
        return this.model.findById(id);
    }

    /**
     * Return all elements matching the specified query
     * @param query The query. If not specified return the collection elements
     */
    async find(query?: RepositoryQuery<Dto>): Promise<MongooseDocumentOfDto[]> {
        return this.model.find(query || {});
    }

    /**
     * Return a the first element matching the specified query
     * @param query The query. If not specified return the first collection element
     */
    async findOne(query?: RepositoryQuery<Dto>): Promise<MongooseDocumentOfDto> {
        return this.model.findOne(query);
    }
}