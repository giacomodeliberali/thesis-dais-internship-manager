import { IBaseEntity } from "./base";
import { Query } from "./index";

/**
 * Mark the entity as readable
 */
export interface IRead<T extends IBaseEntity> {

    /**
     * Return the item with specified id if exists, null otherwise.
     * @param id The item identifier (id property of [[BaseEntity]])
     */
    get(id: string): Promise<T | null>;

    /**
     * Return all elements matching the specified query
     * @param query The query. If not specified return the collection elements
     */
    find(query?: Query<T>): Promise<Array<T>>;

    /**
     * Return a the first element matching the specified query
     * @param query The query. If not specified return the first collection element
     */
    findOne(query?: Query<T>): Promise<T | null>;
}