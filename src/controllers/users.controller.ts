import { Request, Response, Router } from "express";
import { User } from "gdl-thesis-core/dist";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { UsersRepository } from "../repositories";
import { types } from "../utils/di-types";

/**
 * The [[User]] controller
 */
@injectable()
export class UsersController extends BaseController<User> {

  /**
   * Create the controller that handles routes
   * @param usersRepository The users repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    usersRepository: UsersRepository,
    @inject(types.App) app: Express.Application) {

    super(usersRepository, app);
  }
}