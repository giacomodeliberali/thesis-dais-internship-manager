import { Constructor } from "./constructor.model";

/**
 * A database record entry
 */
export abstract class BaseEntity<T> extends Constructor<T> {

    /** The record identifier */
    public _id: string;

    /** The record human friendly code */
    public code: string;

    /** The record row version */
    public get rowVersion() {
        return this._rowVersion;
    }

    /** The record row version (for private set) */
    private _rowVersion: number;

    /**
     * Updates this instance rowVersion with the current timestamp and return the instance
     */
    public get() {
        this._rowVersion = new Date().getTime();
        return this;
    }
}