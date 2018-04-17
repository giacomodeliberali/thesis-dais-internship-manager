import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { types } from "../utils/di-types";
import { verify, sign, decode } from "jsonwebtoken";
import { environment } from "../environment";
import { ApiResponse, User } from "gdl-thesis-core/dist";
import { ServerDefaults } from "../ServerDefaults";
import { UsersRepository } from "../repositories";

/**
 * The Auth controller
 */
@injectable()
export class AuthenticationController {

  /** The express router */
  private router: Router = Router();

  /**
   * Create the controller that handles authentication
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    private usersRepository: UsersRepository,
    @inject(types.App) private app: any) {

  }

  /**
 * Register this controller routes
 * @param useAllCustom Indicates if the custom routes should be registred automatically [default true]
 */
  public register(useAllCustom = true) {
    if (useAllCustom)
      this.useAllCustom();
    this.app.use(`/auth`, this.router);
    return this;
  }

  /**
   * Use custom routes
   */
  public useAllCustom() {
    return this
      .useLogin()
      .useRegister()
      .useDecode();
  }

  /**
   * Decodes the information about the given token
   */
  private useDecode() {
    this.router.get('/token/decode', async (req, res, next) => {
      const token = req.headers['token'] as string;
      if (token) {
        try {
          const isValid = verify(token, environment.jwtSecret);

          if (isValid)
            return new ApiResponse({
              response: res,
              httpCode: 200,
              data: decode(token)
            }).send();
          else
            return new ApiResponse({
              response: res,
              httpCode: 200,
              data: {
                message: "Invalid token"
              }
            }).send();
        } catch (ex) {
          return new ApiResponse({
            response: res,
            httpCode: 500,
            exception: ex
          }).send();
        }

      } else {
        return new ApiResponse({
          response: res,
          httpCode: 400,
          exception: "Bad request"
        }).send();
      }
    });

    return this;
  }

  /**
   * Login in a user and generate its token
   */
  private useLogin() {
    this.router.post('/login', async (req, res, next) => {
      // Check if has body
      if (!req.body || (req.body && (!req.body.password || !req.body.email))) {
        return new ApiResponse({
          response: res,
          httpCode: 400,
          exception: {
            message: "Bad request. Required parameters are 'email' and 'password'"
          }
        }).send();
      }

      const user = await this.usersRepository.login(req.body.email, req.body.password);

      if (user) {
        // Return a new token
        return new ApiResponse({
          response: res,
          httpCode: 200,
          data: sign(user.toJSON(), environment.jwtSecret)
        }).send();
      }

      // Return a new token
      return new ApiResponse({
        response: res,
        httpCode: 401,
        exception: {
          message: "Bad login attempt"
        }
      }).send();
    });
    return this;
  }


  /**
   * Register a new user and generate its token
   */
  public useRegister() {
    this.router.post('/register', async (req, res, next) => {
      // Check if has body
      console.log("REGISTER", req.body);
      if (!req.body || (req.body && (!req.body.password || !req.body.email))) {
        return new ApiResponse({
          response: res,
          httpCode: 400,
          exception: {
            message: "Bad request. Required parameters are 'email' and 'password'"
          }
        }).send();
      }

      const user: User = await this.usersRepository
        .register(req.body)
        .catch(ex => {
          // Return a new token
          return new ApiResponse({
            response: res,
            httpCode: 500,
            exception: ex
          }).send();
        });

      if (user) {
        // Return a new token
        return new ApiResponse({
          response: res,
          httpCode: 200,
          data: {
            user: user,
            token: sign(user, environment.jwtSecret)
          }
        }).send();
      }

      // Return a new token
      return new ApiResponse({
        response: res,
        httpCode: 500,
        exception: {
          message: "Something went wrong creating a new user"
        }
      }).send();
    });
    return this;
  }

  /**
   * Handle all 404 routes. 
   * 
   * Must be called *after* every controller registration.
   */
  public handleMissingRoutes() {
    // Add 404 handler
    this.app.all('*', (req: Request, res: Response) => {
      return new ApiResponse({
        data: null,
        exception: {
          message: "Route not found"
        } as any,
        httpCode: 404,
        response: res,
      }).send();
    });
    return this;
  }
}