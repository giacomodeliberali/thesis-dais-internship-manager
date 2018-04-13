import { Document } from 'mongoose';

export abstract class ConstructorMongoose<T> extends Document {
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