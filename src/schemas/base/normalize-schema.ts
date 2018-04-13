import { IBaseEntity } from 'gdl-thesis-core/dist';
/**
 * Ensure returned object has property id instead of _id and __v
 * @param doc The original document
 * @param ret The document to return
 * @param options The document options
 */
export function normalize(doc: IBaseEntity, ret: IBaseEntity, options: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
}