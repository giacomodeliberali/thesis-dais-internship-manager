import { Constructor } from "./constructor.model";
import { ConstructorMongoose } from "./constructor-moongose.model";

/**
 * A database record entry
 */
export abstract class BaseEntity<T> extends ConstructorMongoose<T> {

    /** The record identifier */
    public id: string;
}