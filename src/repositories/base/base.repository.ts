import { IBaseEntity, RepositoryResponse, IWrite, IRead, Query, Defaults } from "gdl-thesis-core/dist";
import { Collection, Db, ObjectID } from "mongodb";
import { injectable, inject, unmanaged } from "inversify";
import { Model, SchemaType } from "mongoose";

@injectable()
export class BaseRepository<T extends IBaseEntity = any> implements IWrite<T>, IRead<T> {

    /** The collection name, used also as controller route name */
    public collectionName: string;

    /** The moongose model for this repository */
    protected model: Model<T>;

    /**
     * Initialize the base repository
     * @param model The moongose model for this repository
     * @param collectionName The collection name, used also as controller route name
     */
    constructor(
        @unmanaged() model: Model<T>,
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
    private async create(item: T): Promise<RepositoryResponse<T>> {
        const result = await this.model.create(item);

        if (result && result._id)
            return new RepositoryResponse({
                isOk: true,
                objectId: result._id
            });


        return new RepositoryResponse({
            isOk: false
        });
    }

    /**
     * Create or update an element
     * @param element The element to create or update
     */
    async update(item: T): Promise<RepositoryResponse<T>> {
        if (!item.id)
            return this.create(item);

        const result = await this.model.findByIdAndUpdate(item.id, item);

        return new RepositoryResponse({
            isOk: !!result,
            objectId: result.id
        });
    }

    /**
     * Delete an existing element
     * @param id The element identifier
     */
    async delete(id: string): Promise<boolean> {
        return this.model.deleteOne(id);
    }

    /**
     * Return the item with specified id if exists, null otherwise.
     * @param id The item identifier (id property of [[BaseEntity]])
     */
    async get(id: string): Promise<T> {
        return this.model.findById(id);
    }

    /**
     * Return all elements matching the specified query
     * @param query The query. If not specified return the collection elements
     */
    async find(query?: Query<T>): Promise<T[]> {
        return this.model.find(query || {});
    }

    /**
     * Return a the first element matching the specified query
     * @param query The query. If not specified return the first collection element
     */
    async findOne(query?: Query<T>): Promise<T> {
        return this.model.findOne(query);
    }
}