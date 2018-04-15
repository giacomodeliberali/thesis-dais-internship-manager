"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceLocator {
    static resolve(className) {
        return new className();
    }
}
exports.ServiceLocator = ServiceLocator;
//# sourceMappingURL=service-locator.service.js.map