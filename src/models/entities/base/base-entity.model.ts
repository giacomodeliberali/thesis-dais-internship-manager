import { Constructor } from "./constructor.model";
import { Document } from 'mongoose';
/**
 * A database record entry
 */
export abstract class BaseEntity<T> extends Document {

    /** The record identifier */
    public id: string;

    /**
     * Creates a generic type T instance object
     * @param item The item to assign to this instance
     */
    constructor(item?: Partial<T>) {
        super();
        if (item)
            Object.assign(this, item);
    }
}