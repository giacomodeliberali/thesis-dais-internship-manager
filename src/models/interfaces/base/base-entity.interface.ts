import { Document as MDocument } from 'mongoose';

/**
 * A database record entry
 */
export interface IBaseEntity extends MDocument {

    /** The record identifier */
    id: string;
}