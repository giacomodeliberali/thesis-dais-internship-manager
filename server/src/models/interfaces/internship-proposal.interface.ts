import { IBaseEntity } from "./base";
import { InternshipProposal } from "thesis-dais-internship-manager-core";

/**
 * A [[Internship]] proposed by a student [[User]]
 */
export interface IInternshipProposal extends IBaseEntity, InternshipProposal {

}