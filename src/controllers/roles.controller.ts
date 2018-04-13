import { Request, Response, Router } from "express";
import { Role, inject } from "gdl-thesis-core/dist";
import { BaseController } from "./base/base.controller";
import { IUsersRepository } from "../repositories/base/users.repository.interface";
import { IRolesRepository } from "../repositories/base/roles.repository.interface";

/**
 * The roles controller
 */
export class RolesController extends BaseController<Role> {

  /**
   * Create the controller that handles routes
   * @param rolesRepository The roles repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(rolesRepository: IRolesRepository, app: any) {
    super(rolesRepository, app);
  }
}