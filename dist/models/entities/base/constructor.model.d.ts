export declare abstract class Constructor<T> {
    /**
     * Creates a generic type T instance object
     * @param item The item to assign to this instance
     */
    constructor(item?: Partial<T>);
    /** Return a clone with JSON.parse(JSON.stringify(this)) */
    clone?: () => any;
}
