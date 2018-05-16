import { Pipe, PipeTransform, Injector } from "@angular/core";
import { Address } from "gdl-thesis-core/dist";

/**
 * Format an [[Address]] object to a string
 */
@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {

    constructor(private injector: Injector) {

    }

    transform(value: Address, pipe: PipeTransform): any {

        if (value) {
            return `${value.street || ''} ${value.number || ''}, ${value.city || ''}${value.zip ? ' - ' + value.zip : ''}, ${value.state}`;
        }

        return '';
    }
}