import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { types } from "../utils/di-types";
import { verify, sign, decode } from "jsonwebtoken";
import { environment } from "../environment";
import { ApiResponse } from "gdl-thesis-core/dist";
import { cat } from "shelljs";
import { ServerDefaults } from "../ServerDefaults";

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
    @inject(types.App) private app: any) {

    this.useAuth();
  }

  /**
   * Enable JWT generation and verification
   */
  private useAuth() {
    this.router.post('/token', async (req, res, next) => {
      const token = req.headers[ServerDefaults.jwtTokenHeaderName] as string;
      if (token) {
        // Verify token
        try {
          const isValid = verify(token, environment.jwtSecret);

          // Is is valid return it
          if (isValid)
            return new ApiResponse({
              response: res,
              httpCode: 200,
              data: token
            }).send();

          // Check if has body
          if (!req.body) {
            return new ApiResponse({
              response: res,
              httpCode: 400,
              exception: "Bad request"
            }).send();
          }

          // Return a new token
          return sign(req.body, environment.jwtSecret);
        } catch (ex) {
          return new ApiResponse({
            response: res,
            httpCode: 500,
            exception: ex
          }).send();
        }
      } else {
        // Check if has body
        if (!req.body) {
          return new ApiResponse({
            response: res,
            httpCode: 400,
            exception: "Bad request"
          }).send();
        }

        // Return a new token
        return new ApiResponse({
          response: res,
          httpCode: 200,
          data: sign(req.body, environment.jwtSecret)
        }).send();
      }
    });

    // Decodes the information about the given token
    this.router.get('/token', async (req, res, next) => {
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

  /**
   * Register this controller routes to the global express application
   */
  public register() {
    this.app.use(`/auth`, this.router);
    return this;
  }
}