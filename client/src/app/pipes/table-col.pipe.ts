import { Pipe, PipeTransform, Injector } from "@angular/core";

/**
 * A table column pipe for formatting different values
 */
@Pipe({ name: 'tablecol' })
export class TableColPipe implements PipeTransform {

    /**
     * Creates an instance of TableColPipe.
     * @param {Injector} injector The app injector
     */
    constructor(private injector: Injector) {

    }

    /**
     * Format the value with the given pipe
     *
     * @param {*} value The value to format
     * @param {PipeTransform} pipe The pipe to use
     */
    transform(value: any, pipe: PipeTransform): any {

        if (pipe) {
            try {
                pipe = this.injector.get(pipe);
                if (pipe && pipe.transform)
                    return pipe.transform(value);
            } catch (ex) {
                console.error("Cannot use pipe => ", pipe, ex);
            }
        }

        return value;
    }
}