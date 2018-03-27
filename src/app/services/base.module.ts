import { Injector, ApplicationRef } from "@angular/core";
import { ServiceLocator } from "./service-locator.service";

export class BaseModule {

    constructor(private injector: Injector) {
        ServiceLocator.injector = injector;
    }
}
