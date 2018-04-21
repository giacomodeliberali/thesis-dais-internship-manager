import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { types } from "../utils/di-types";
import { verify, sign, decode } from "jsonwebtoken";
import { environment } from "../environment";
import { ApiResponse, User, IRole, IUser } from "gdl-thesis-core/dist";
import { ServerDefaults } from "../ServerDefaults";
import { UsersRepository, RolesRepository } from "../repositories";
import * as passport from 'passport';
import { use as passportUse } from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthType } from "gdl-thesis-core/dist/models/enums/auth-type.enum";
import { RoleType } from "gdl-thesis-core/dist";
const GooglePlusTokenStrategy = require('passport-google-plus-token');
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
    private rolesRepository: RolesRepository,
    @inject(types.App) private app: any) {

  }

  /**
 * Register this controller routes
 * @param useAllCustom Indicates if the custom routes should be registred automatically [default true]
 */
  public register() {
    this
      .useLogin()
      .useRegister()
      .useGoogleOAuth()
      .useDecode();

    this.app.use(`/auth`, this.router);

    return this;
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

      const user = await this.usersRepository.login(req.body.email, req.body.password)
        .catch(ex => {
          // Return a new token
          return new ApiResponse({
            response: res,
            httpCode: 401,
            exception: ex
          }).send();
        });

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
      if (!req.body || (req.body && (!req.body.password || !req.body.email))) {
        return new ApiResponse({
          response: res,
          httpCode: 400,
          exception: {
            message: "Bad request. Required parameters are 'email' and 'password'"
          }
        }).send();
      }

      if (req.body.authType !== AuthType.Local) {
        return new ApiResponse({
          response: res,
          httpCode: 400,
          exception: {
            message: "The authType must be 'Local'"
          }
        }).send();
      }

      req.body.role = (await this.rolesRepository.findOne({ type: RoleType.Company }))._id;

      const user: IUser = await this.usersRepository
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
            token: sign(user.toJSON(), environment.jwtSecret)
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

  /** Use Google OAuth as auth provider */
  public useGoogleOAuth() {
    // Google OAuth Strategy
    passportUse('google-plus-token',
      new GooglePlusTokenStrategy({
        clientID: environment.googleOAuth.clientId,
        clientSecret: environment.googleOAuth.clientSecret
      },
        async (accessToken: string, refreshToken: string, profile: any, next: Function) => {
          try {
            // Should have full user profile over here

            const existingUser = await this.usersRepository.findOne({ "googleId": profile.id });
            if (existingUser) {
              return next(null, existingUser.toJSON());
            }

            const email: string = profile.emails[0].value;
            let role: IRole = null;

            if (email.endsWith("@stud.unive.it")) {
              // Student
              role = await this.rolesRepository.findOne({ type: RoleType.Student });
            } else if (email.endsWith("@unive.it")) {
              // Professor
              role = await this.rolesRepository.findOne({ type: RoleType.Professor });
            } else {
              return next({ message: "User email not supported. Only members of @unive can use this service." }, false);
            }

            const newUser = await this.usersRepository.update({
              authType: AuthType.Google,
              email: email,
              googleId: profile.id,
              name: profile.displayName,
              registrationDate: new Date(),
              role: role._id as any
            } as IUser);
            next(null, newUser.toJSON());
          } catch (error) {
            console.log("ERROR => ", error);
            next(error, false);
          }
        })
    );


    this.router.post('/google', async (req, res, next) => {
      passport.authenticate('google-plus-token', function (error, user) {
        if (error)
          return new ApiResponse({
            response: res,
            httpCode: 401,
            exception: error
          }).send();

        return new ApiResponse({
          response: res,
          httpCode: 200,
          data: {
            user: user,
            token: sign(user, environment.jwtSecret)
          }
        }).send();
      })(req, res);
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