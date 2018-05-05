import { Pipe, PipeTransform, Injector } from "@angular/core";

/**
 * A table column pipe for formatting different values
 */
@Pipe({ name: 'tablecol' })
export class TableColPipe implements PipeTransform {

    constructor(private injector: Injector) {

    }

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