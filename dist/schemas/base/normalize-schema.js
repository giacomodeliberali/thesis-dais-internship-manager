"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ensure returned object has property id instead of _id and __v
 * @param doc The original document
 * @param ret The document to return
 * @param options The document options
 */
function normalize(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
}
exports.normalize = normalize;
