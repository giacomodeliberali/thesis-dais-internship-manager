import { Request, Response, Router, RequestHandler } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { UsersRepository } from "../repositories";
import { types } from "../utils/di-types";
import { ApiResponse } from "../models/api-response.model";
import { IUser } from "../models/interfaces";
import { User } from "gdl-thesis-core/dist";
import { ServerDefaults } from "../ServerDefaults";

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
   * Use custom routes
   */
  public useAllCustom() {
    return this
      .useGetByRoles()
      .useUpdateOwn();
  }

  /**
   * Return all users with role matching al least one of the given roles
   */
  public useGetByRoles(middleware?: Array<RequestHandler>) {
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

  public useUpdateOwn() {
    this.router.put('/own', async (req, res) => {
      const user: User = req.body;
      if (user && user.id === req.body[ServerDefaults.authUserBodyPropertyName].id) {
        // The user to update is the same as token
        return this.usersRepository.updateOwn(req.body)
          .then(result => {
            return new ApiResponse({
              data: result,
              httpCode: 200,
              response: res
            }).send();
          });
      } else {
        return new ApiResponse({
          exception: {
            message: "You can not update a user with a mismatching token. The user id you want to update does not correspond with you token",
            code: "auth/user-unauthorized"
          },
          httpCode: 401,
          response: res
        }).send();
      }
    });
    return this;
  }
}