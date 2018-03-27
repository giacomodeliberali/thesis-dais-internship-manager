import { BaseEntity, ServiceResponse } from "../entities/base";
/**
 * Mark the entity as writable
 */
export interface IWrite<T extends BaseEntity<T>> {
    /**
     * Create or update an element
     * @param element The element to create or update
     */
    update(element: T): Promise<ServiceResponse<T>>;
    /**
     * Delete an existing element
     * @param id The element identifier
     */
    delete(id: string): Promise<boolean>;
}
