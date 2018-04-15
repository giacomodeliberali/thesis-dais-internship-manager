"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constructor_model_1 = require("./constructor.model");
/**
 * A database record entry
 */
class BaseEntity extends constructor_model_1.Constructor {
    /** The record row version */
    get rowVersion() {
        return this._rowVersion;
    }
    /**
     * Updates this instance rowVersion with the current timestamp and return the instance
     */
    get() {
        this._rowVersion = new Date().getTime();
        return this;
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base-entity.model.js.map