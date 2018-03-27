import { BaseEntity } from "../entities/base";

/**
 * The query interface used to make request in MongoDB
 */
export type Query<T> = {
    /** Filter in "and" in these properties */
    [P in keyof T]?: T[P] | 
    {
        /** Equals --> = */
        $eq?: T[P];
        /** Grather than --> > */
        $gt?: T[P];
        /** Grather or equal than --> >= */
        $gte?: T[P];
        /** In --> ["A","B"] */
        $in?: T[P][];
        /** Less than --> < */
        $lt?: T[P];
        /** Less or equal than --> <= */
        $lte?: T[P];
        /** In --> ["A","B"] */
        $ne?: T[P];
        /** Not in --> ["A","B"] */
        $nin?: T[P][];

        /** Logical "and" */
        $and?: (Query<T[P]> | T[P])[];
        /** Logical "or" */
        $or?: (Query<T[P]> | T[P])[];
        /** Logical "not" */
        $not?: (Query<T[P]> | T[P])[] | T[P];
        
        $expr?: any;
        $jsonSchema?: any;
        $mod?: [number, number];
        $regex?: RegExp;
        $options?: string;
        $text?: {
            $search: string;
            $language?: string;
            $caseSensitive?: boolean;
            $diacraticSensitive?: boolean;
        };
        $where: Object;
        $geoIntersects?: Object;
        $geoWithin?: Object;
        $near?: Object;
        $nearSphere?: Object;
        $elemMatch?: Object;
        $size?: number;
        $bitsAllClear?: Object;
        $bitsAllSet?: Object;
        $bitsAnyClear?: Object;
        $bitsAnySet?: Object;
        [key: string]: any;
    };
    } | 
    {
        [key: string]: any
    };