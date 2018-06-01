import { Schema } from 'mongoose';
import { IBaseEntity } from '../../models/interfaces';
/**
 * Ensure returned object has property id instead of _id and __v
 * @param doc The original document
 * @param ret The document to return
 * @param options The document options
 */
export function normalizeToJson(doc: IBaseEntity, ret: IBaseEntity) {
    delete ret._id;
    delete ret.__v;
}

/**
 * Ensure returned object has property id instead of _id and __v
 * @param doc The original document
 * @param ret The document to return
 * @param options The document options
 */
export function normalizeToObject(doc: IBaseEntity, ret: IBaseEntity) {
    delete ret.__v;
}

/**
 * Ensure returned object has property id instead of _id and __v
 * @param schema The schema to normalize
 */
export function normalizeSchema(schema: Schema) {

    // Add id virtual property
    schema.virtual('id').get(function (this: IBaseEntity) {
        return this._id.toString();
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