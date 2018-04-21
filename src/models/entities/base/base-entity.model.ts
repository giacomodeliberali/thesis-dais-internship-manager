import { Constructor } from ".";

/**
 * A base entity with constructor and identifier
 */
export abstract class BaseEntity<T> extends Constructor<T>{
    /** The record identifier */
    id?: string;
}