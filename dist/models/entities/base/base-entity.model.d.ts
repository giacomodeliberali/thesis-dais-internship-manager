import { Constructor } from "./constructor.model";
/**
 * A database record entry
 */
export declare abstract class BaseEntity<T> extends Constructor<T> {
    /** The record identifier */
    _id: string;
    /** The record human friendly code */
    code: string;
    /** The record row version */
    readonly rowVersion: number;
    /** The record row version (for private set) */
    private _rowVersion;
    /**
     * Updates this instance rowVersion with the current timestamp and return the instance
     */
    get(): this;
}
