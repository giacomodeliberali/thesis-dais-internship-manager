import { Request, Response, Router } from "express";
import { IUser, ApiResponse } from "gdl-thesis-core/dist";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { UsersRepository } from "../repositories";
import { types } from "../utils/di-types";

/**
 * The [[User]] controller
 */
@injectable()
export class UsersController extends BaseController<IUser> {

  /**
   * Create the controller that handles routes
   * @param usersRepository The users repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    private usersRepository: UsersRepository,
    @inject(types.App) app: Express.Application) {

    super(usersRepository, app);
  }

  /**
   * Register this controller routes
   * @param useAllCustom Indicates if the custom routes should be registred automatically [default true]
   */
  public register(useAllCustom = true) {

    if (useAllCustom)
      this.useAllCustom();

    return super.register();
  }

  /**
   * Use custom routes
   */
  public useAllCustom() {
    return this.useGetByRoles();
  }

  /**
   * Return all users with role matching al least one of the given roles
   */
  public useGetByRoles() {
    this.router.post('/getByRoles', async (req, res) => {
      this.usersRepository.getByRoles(req.body.roles)
        .then(result => {
          return new ApiResponse({
            data: result,
            httpCode: 200,
            response: res
          }).send();
        });
    });

    this.router.get('/getByRole/:role', async (req, res) => {
      this.usersRepository.getByRoles(req.params.role)
        .then(result => {
          return new ApiResponse({
            data: result,
            httpCode: 200,
            response: res
          }).send();
        });
    });
    return this;
  }
}