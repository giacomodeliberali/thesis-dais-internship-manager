export abstract class Constructor<T>{
    /**
     * Creates a generic type T instance object
     * @param item The item to assign to this instance
     */
    constructor(item?: Partial<T>) {
        if (item)
            Object.assign(this, item);
    }
}