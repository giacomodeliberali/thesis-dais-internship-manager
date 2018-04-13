import { IBaseEntity } from "./base";
import { RepositoryResponse } from "../index";

/**
 * Mark the entity as writable
 */
export interface IWrite<T extends IBaseEntity> {

    /**
     * Create or update an element
     * @param element The element to create or update
     */
    update(element: T): Promise<RepositoryResponse<T>>;

    /**
     * Delete an existing element
     * @param id The element identifier
     */
    delete(id: string): Promise<boolean>;
}