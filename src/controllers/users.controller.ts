import { Request, Response, Router, RequestHandler } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { UsersRepository } from "../repositories";
import { types } from "../utils/di-types";
import { ApiResponse } from "../models/api-response.model";
import { IUser } from "../models/interfaces";
import { User, RoleType } from "gdl-thesis-core/dist";
import { ServerDefaults } from "../ServerDefaults";
import { adminScope } from "../utils/auth/scopes";
import { sign } from "jsonwebtoken";
import { environment } from "../environment";

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

  public useCustoms() {
    return this
      .useGetByRoles([adminScope])
      .useUpdateOwn()
      .useLookupProfessor();
  }

  /**
   * Return all users with role matching al least one of the given roles
   */
  private useGetByRoles(middleware?: Array<RequestHandler>) {
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

  /**
   * Allow the the user specified in the token to update its onw user information
   */
  private useUpdateOwn() {
    this.router.put('/own', async (req, res) => {
      const user: User = req.body;
      if (user && user.id === req.body[ServerDefaults.authUserBodyPropertyName].id) {
        // The user to update is the same as token
        return this.usersRepository.updateOwn(req.body)
          .then(result => {
            return new ApiResponse({
              data: {
                user: result,
                token: sign(result.toJSON(), environment.jwtSecret)
              },
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

  /**
   * Return all the [[User]] with role Professor matching the given search string
   */
  private useLookupProfessor() {
    this.router.post('/professors/lookup', async (req, res) => {
      const search: string = req.body.search;

      let professors = await this.usersRepository.getByRoles(RoleType.Professor);
      professors = professors.filter(p => p.name.toLowerCase().indexOf(search.toLowerCase()) >= 0);

      if (search) {
        return new ApiResponse({
          data: professors,
          httpCode: 200,
          response: res
        }).send();
      } else {
        return new ApiResponse({
          data: professors,
          httpCode: 200,
          response: res
        }).send();
      }
    });
    return this;
  }
}