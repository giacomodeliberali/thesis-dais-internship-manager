import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { CompaniesRepository, InternshipsRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IInternship } from "../models/interfaces";

/**
 * The [[Internship]] controller
 */
@injectable()
export class InternshipsController extends BaseController<IInternship> {

  /**
   * Create the controller that handles routes
   * @param internshipsRepository The companies repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    internshipsRepository: InternshipsRepository,
    @inject(types.App) app: Express.Application) {

    super(internshipsRepository, app);
  }
}