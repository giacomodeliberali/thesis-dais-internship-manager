"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constructor = /** @class */ (function () {
    /**
     * Creates a generic type T instance object
     * @param item The item to assign to this instance
     */
    function Constructor(item) {
        if (item)
            Object.assign(this, item);
    }
    /** Return a clone with JSON.parse(JSON.stringify(this)) */
    Constructor.prototype.clone = function () {
        return JSON.parse(JSON.stringify(this));
    };
    return Constructor;
}());
exports.Constructor = Constructor;
