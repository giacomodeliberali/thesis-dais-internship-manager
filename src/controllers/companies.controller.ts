import { Request, Response, Router } from "express";
import { ICompany } from "gdl-thesis-core/dist";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { CompaniesRepository } from "../repositories";
import { types } from "../utils/di-types";

/**
 * The [[Company]] controller
 */
@injectable()
export class CompaniesController extends BaseController<ICompany> {

  /**
   * Create the controller that handles routes
   * @param companiesRepository The companies repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    companiesRepository: CompaniesRepository,
    @inject(types.App) app: Express.Application) {

    super(companiesRepository, app);
  }
}