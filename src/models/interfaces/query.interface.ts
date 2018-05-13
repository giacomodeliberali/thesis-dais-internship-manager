import { Query } from "mongoose";

/** A type used to query a mongoose entity */
type Properties<Dto> = { [P in keyof Dto]?: Dto[P] };

/** The repository query request */
export type RepositoryQuery<Dto> = Properties<Dto> | Query<Dto> | { _id: string };