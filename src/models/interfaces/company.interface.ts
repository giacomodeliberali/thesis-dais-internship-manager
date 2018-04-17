import { IBaseEntity } from "./base";
import { Company } from '../entities/company.model'

/** A company */
export interface ICompany extends IBaseEntity, Company {

}