import { ConstructorMongoose } from "./constructor-moongose.model";
/**
 * A database record entry
 */
export declare abstract class BaseEntity<T> extends ConstructorMongoose<T> {
    /** The record identifier */
    id: string;
}
