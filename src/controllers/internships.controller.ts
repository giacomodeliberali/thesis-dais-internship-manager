import { Request, Response, Router } from "express";
import { Internship } from "gdl-thesis-core/dist";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { CompaniesRepository, InternshipsRepository } from "../repositories";
import { types } from "../di-types";

/**
 * The [[Internship]] controller
 */
@injectable()
export class InternshipsController extends BaseController<Internship> {

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