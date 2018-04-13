/// <reference types="mongoose" />
/**
 * A database record entry
 */
export declare abstract class BaseEntity<T> extends Document {
    /** The record identifier */
    id: string;
    /**
     * Creates a generic type T instance object
     * @param item The item to assign to this instance
     */
    constructor(item?: Partial<T>);
}
