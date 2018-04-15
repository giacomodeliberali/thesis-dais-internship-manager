"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CollectionName(name) {
    console.log("[CollectionName] name", name);
    return (target) => {
        Object.assign(target.prototype, {
            collectionName: name
        });
    };
}
exports.CollectionName = CollectionName;
//# sourceMappingURL=collection-name.decorator.js.map