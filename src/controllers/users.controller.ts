import { Request, Response, Router } from "express";
import { User, inject } from "gdl-thesis-core/dist";
import { BaseController } from "./base/base.controller";
import { IUsersRepository } from "../repositories/base/users.repository.interface";

/**
 * The [[User]] controller
 */
export class UsersController extends BaseController<User> {

  /**
   * Create the controller that handles routes
   * @param usersRepository The users repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(usersRepository: IUsersRepository, app: any) {
    super(usersRepository, app);
  }
}