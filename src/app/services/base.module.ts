import { Injector, ApplicationRef } from "@angular/core";
import { ServiceLocator } from "./service-locator.service";
/**
 * The base module with the shared injector
 */
export class BaseModule {
    
    /**
     * Creates an instance of BaseModule.
     * @param {Injector} injector The app injector
     */
    constructor(private injector: Injector) {
        ServiceLocator.injector = injector;
    }
}
