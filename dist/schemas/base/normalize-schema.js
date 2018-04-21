"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ensure returned object has property id instead of _id and __v
 * @param doc The original document
 * @param ret The document to return
 * @param options The document options
 */
function normalizeToJson(doc, ret) {
    delete ret._id;
    delete ret.__v;
}
exports.normalizeToJson = normalizeToJson;
/**
 * Ensure returned object has property id instead of _id and __v
 * @param doc The original document
 * @param ret The document to return
 * @param options The document options
 */
function normalizeToObject(doc, ret) {
    delete ret.__v;
}
exports.normalizeToObject = normalizeToObject;
/**
 * Ensure returned object has property id instead of _id and __v
 * @param schema The schema to normalize
 */
function normalizeSchema(schema) {
    // Add id virtual property
    schema.virtual('id').get(function () {
        return this._id;
    });
    // Remove _id and __v
    schema.set('toJSON', {
        transform: normalizeToJson,
        virtuals: true
    });
    // Remove __v
    schema.set('toObject', {
        transform: normalizeToObject,
        virtuals: true
    });
    return schema;
}
exports.normalizeSchema = normalizeSchema;
