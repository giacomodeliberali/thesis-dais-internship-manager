import { IBaseEntity } from "../interfaces";
/**
 * A typed response from a repository
 */
export declare class RepositoryResponse<T extends IBaseEntity> {
    /** The creates or updated object id */
    objectId: string;
    /** The status of the operation */
    isOk: boolean;
    /**
     * Create a new typed repository response
     * @param item The response
     */
    constructor(item?: Partial<RepositoryResponse<T>>);
}
