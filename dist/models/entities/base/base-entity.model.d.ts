import { Constructor } from ".";
/**
 * A base entity with constructor and identifier
 */
export declare abstract class BaseEntity<T> extends Constructor<T> {
    /** The record identifier */
    id?: string;
}
