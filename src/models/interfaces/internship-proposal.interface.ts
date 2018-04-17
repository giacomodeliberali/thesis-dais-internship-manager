import { IBaseEntity } from "./base";
import { InternshipProposal } from "../entities";

/**
 * A [[Internship]] proposed by a student [[User]]
 */
export interface IInternshipProposal extends IBaseEntity, InternshipProposal {

}