import { Request, Response, Router } from "express";
import { IInternshipProposal } from "gdl-thesis-core/dist";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { InternshipsProposalsRepository } from "../repositories";
import { types } from "../utils/di-types";

/**
 * The [[InternshipProposal]] controller
 */
@injectable()
export class InternshipProposalsController extends BaseController<IInternshipProposal> {

  /**
   * Create the controller that handles routes
   * @param internshipProposalsRepository The companies repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    internshipProposalsRepository: InternshipsProposalsRepository,
    @inject(types.App) app: Express.Application) {

    super(internshipProposalsRepository, app);
  }
}