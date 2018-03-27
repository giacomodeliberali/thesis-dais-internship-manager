import { BaseEntity } from "./base";

/**
 * A typed response from a repository
 */
export class RepositoryResponse<T extends BaseEntity<T>> {

    /** The creates or updated object id */
    public objectId: string;

    /** The status of the operation */
    public isOk: boolean;

    /**
     * Create a new typed repository response
     * @param item The response
     */
    constructor(item?: Partial<RepositoryResponse<T>>) {
        if (item)
            Object.assign(this, item);
    }

}