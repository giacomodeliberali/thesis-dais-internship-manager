import { BaseEntity } from "./index";
/**
 * A typed response from a repository
 */
export declare class ServiceResponse<T extends BaseEntity<T>> {
    /** The creates or updated object id */
    objectId: string;
    /** The status of the operation */
    isOk: boolean;
    /**
     * Creates a new service response
     * @param item The response
     */
    constructor(item?: Partial<ServiceResponse<T>>);
}
