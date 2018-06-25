import { Pipe, PipeTransform, Injector } from "@angular/core";
import { Address } from "gdl-thesis-core/dist";

/**
 * Format an [[Address]] object to a string
 */
@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {

    /**
     * Creates an instance of AddressPipe.
     * @param {Injector} injector The injector
     */
    constructor(private injector: Injector) {

    }
    /**
     * Format the address object to a string
     *
     * @param {Address} value The address to format
     */
    transform(value: Address): any {

        if (value) {
            return `${value.street || ''} ${value.number || ''}, ${value.city || ''}${value.zip ? ' - ' + value.zip : ''}, ${value.state}`;
        }

        return '';
    }
}