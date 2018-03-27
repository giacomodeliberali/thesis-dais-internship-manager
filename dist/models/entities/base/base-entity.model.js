"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var constructor_model_1 = require("./constructor.model");
/**
 * A database record entry
 */
var BaseEntity = /** @class */ (function (_super) {
    __extends(BaseEntity, _super);
    function BaseEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BaseEntity.prototype, "rowVersion", {
        /** The record row version */
        get: function () {
            return this._rowVersion;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates this instance rowVersion with the current timestamp and return the instance
     */
    BaseEntity.prototype.get = function () {
        this._rowVersion = new Date().getTime();
        return this;
    };
    return BaseEntity;
}(constructor_model_1.Constructor));
exports.BaseEntity = BaseEntity;
