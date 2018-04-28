import { IBaseEntity } from "./base";
import { InternshipProposal } from "gdl-thesis-core/dist";

/**
 * A [[Internship]] proposed by a student [[User]]
 */
export interface IInternshipProposal extends IBaseEntity, InternshipProposal {

}