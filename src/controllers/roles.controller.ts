import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { RolesRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IRole } from "../models/interfaces";

/**
 * The [[Role]] controller
 */
@injectable()
export class RolesController extends BaseController<IRole> {

  /**
   * Create the controller that handles routes
   * @param rolesRepository The roles repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    rolesRepository: RolesRepository,
    @inject(types.App) app: Express.Application) {

    super(rolesRepository, app);
  }
}