import { BaseEntity, RepositoryResponse, IWrite, IRead, Query } from "gdl-thesis-core/dist";
import { Collection, Db, ObjectID } from "mongodb";

export abstract class BaseRepository<T extends BaseEntity<T>> implements IWrite<T>, IRead<T> {


    /** The current collection  */
    public readonly _collection: Collection<T>;

    /**
     * Initialize the base repository
     * @param db The mongodb database instance
     * @param collectionName The current collection name
     */
    constructor(protected db: Db, public collectionName: string) {
        this._collection = db.collection(collectionName);
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
        const result = await this._collection.insertOne(item);
        return new RepositoryResponse({
            isOk: !!result.result.ok,
            objectId: result.insertedId.toHexString()
        });
    }

    /**
     * Create or update an element
     * @param element The element to create or update
     */
    async update(item: T): Promise<RepositoryResponse<T>> {
        if (!item._id)
            return this.create(item);

        const result = await this._collection.updateOne({
            _id: this.getObjectId(item._id)
        }, item);

        return new RepositoryResponse({
            isOk: !!result.result.ok,
            objectId: result.upsertedId._id.toHexString()
        });
    }

    /**
     * Delete an existing element
     * @param id The element identifier
     */
    async delete(id: string): Promise<boolean> {
        const result = await this._collection.deleteOne({
            _id: this.getObjectId(id)
        });
        return !!result.result.ok;
    }

    /**
     * Return the item with specified id if exists, null otherwise.
     * @param id The item identifier (id property of [[BaseEntity]])
     */
    async get(id: string): Promise<T> {
        const result = await this._collection.find<T>({
            _id: this.getObjectId(id)
        }).toArray();

        if (result && result.length > 0)
            return result[0];

        return null;
    }

    /**
     * Return all elements matching the specified query
     * @param query The query. If not specified return the collection elements
     */
    async find(query?: Query<T>): Promise<T[]> {
        return this._collection.find<T>(query || {}).toArray();
    }

    /**
     * Return a the first element matching the specified query
     * @param query The query. If not specified return the first collection element
     */
    async findOne(query?: Query<T>): Promise<T> {
        const result = await this._collection.find<T>(query).toArray();

        if (result && result.length > 0)
            return result[0];

        return null;
    }
}