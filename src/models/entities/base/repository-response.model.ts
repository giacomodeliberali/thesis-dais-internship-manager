import { BaseEntity } from "./index";

/**
 * A typed response from a repository
 */
export class ServiceResponse<T extends BaseEntity<T>> {

    /** The creates or updated object id */
    public objectId: string;

    /** The status of the operation */
    public isOk: boolean;

    /**
     * Creates a new service response
     * @param item The response
     */
    constructor(item?: Partial<ServiceResponse<T>>) {
        if (item)
            Object.assign(this, item);
    }

}