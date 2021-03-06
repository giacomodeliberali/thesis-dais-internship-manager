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
var ConstructorMongoose = /** @class */ (function (_super) {
    __extends(ConstructorMongoose, _super);
    /**
     * Creates a generic type T instance object
     * @param item The item to assign to this instance
     */
    function ConstructorMongoose(item) {
        var _this = _super.call(this) || this;
        if (item)
            Object.assign(_this, item);
        return _this;
    }
    return ConstructorMongoose;
}(Document));
exports.ConstructorMongoose = ConstructorMongoose;
