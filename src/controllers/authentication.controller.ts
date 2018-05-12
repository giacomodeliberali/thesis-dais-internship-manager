import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { types } from "../utils/di-types";
import { verify, sign, decode } from "jsonwebtoken";
import { environment } from "../environment";
import { User } from "gdl-thesis-core/dist";
import { ServerDefaults } from "../ServerDefaults";
import { UsersRepository, RolesRepository } from "../repositories";
import * as passport from 'passport';
import { use as passportUse } from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthType } from "gdl-thesis-core/dist/models/enums/auth-type.enum";
import { RoleType } from "gdl-thesis-core/dist";
import { ApiResponse } from "../models/api-response.model";
import { IRole, IUser } from "../models/interfaces";
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
 * Return true if the given token is valid, false otherwise
 */
  public static ValidateToken = (token) => {
    if (token) {
      try {
        const isValid = verify(token, environment.jwtSecret, {
          ignoreExpiration: false
        });

        return !!isValid;
      } catch (ex) {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * The authentication middleware. Populate the request.body with the [[ServerDefaults.authUserBodyPropertyName]] property
   * containing the token user
   */
  public static AuthMiddleware = async (req, res, next) => {

    const token = req.headers[ServerDefaults.jwtTokenHeaderName] as string;
    if (token) {
      // Verify token
      const isValid = AuthenticationController.ValidateToken(token);

      // Is is valid proceed
      if (isValid) {
        req.body[ServerDefaults.authUserBodyPropertyName] = decode(token);
        return next();
      }

      // Otherwise throw an auth error
      return new ApiResponse({
        response: res,
        httpCode: 401,
        exception: {
          message: "Invalid token. Unauthorized",
          code: "auth/user-unauthorized"
        }
      }).send();
    } else {
      // Token not found, throw an auth error
      return new ApiResponse({
        response: res,
        httpCode: 401,
        exception: {
          message: "Missing token. Unauthorized",
          code: "auth/user-unauthorized"
        }
      }).send();
    }
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
      .useTokenValidate();

    if (environment.isDebug)
      this.useTokenDecode();

    this.app.use(`/auth`, this.router);

    return this;
  }

  /**
   * Decodes the information about the given token
   */
  private useTokenDecode() {
    this.router.get('/token/decode', async (req, res, next) => {
      const token = req.headers[ServerDefaults.jwtTokenHeaderName] as string;
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
      try {
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
            data: {
              user: user.toJSON(),
              token: sign(user.toJSON(), environment.jwtSecret),
              isNew: false
            }
          }).send();
        }

        // Return error
        return new ApiResponse({
          response: res,
          httpCode: 401,
          exception: {
            message: "Bad login attempt",
            code: "auth/bad-login"
          }
        }).send();
      } catch (ex) {
        // Return a new token
        return new ApiResponse({
          response: res,
          httpCode: 401,
          exception: ex
        }).send();
      }
    });
    return this;
  }


  /**
   * Register a new user and generate its token
   */
  private useRegister() {
    this.router.post('/register', async (req, res, next) => {
      try {
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

        // Set the authType to local
        req.body.authType = AuthType.Local;

        // Find 'Company' role
        const role = await this.rolesRepository.getOrCreateOne(RoleType.Company, "Company");
        req.body.role = role.id;

        // Register the user
        const user = await this.usersRepository.register(req.body);

        if (user) {
          // Return a new token
          return new ApiResponse({
            response: res,
            httpCode: 200,
            data: {
              user: user.toObject(),
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
      } catch (ex) {
        // Return a new token
        return new ApiResponse({
          response: res,
          httpCode: 500,
          exception: ex
        }).send();
      }
    });
    return this;
  }

  /** Use Google OAuth as auth provider */
  private useGoogleOAuth() {
    // Google OAuth Strategy
    passportUse('google-plus-token',
      new GooglePlusTokenStrategy({
        clientID: environment.googleOAuth.clientId,
        clientSecret: environment.googleOAuth.clientSecret
      },
        async (accessToken: string, refreshToken: string, profile: any, next: (error: any, userData?: { user: User, isNew: boolean }) => void) => {
          // Login was successful
          try {
            let userData: {
              user: User,
              isNew: boolean
            } = null;

            // Check if user exist
            const existingUser = await this.usersRepository.findOne({ googleId: profile.id });
            if (existingUser) {
              // User exists, return it
              userData = {
                user: existingUser.toJSON(),
                isNew: false
              };
              return next(null, userData);
            }

            // Pick email
            let email: string;
            try {
              email = profile.emails[0].value;
            } catch (ex) {
              throw new Error("The Google profile object does not contain a valid email address");
            }
            const photo: string = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

            // Find a role corresponding with its email:
            // If email ends with @stud.unive.it => Search for 'Student'
            // If email ends with @unive.it => Search for 'Professor'
            // Else operation not supported

            let role: IRole = null;

            if (email.endsWith("@stud.unive.it")) {
              // Student
              role = await this.rolesRepository.getOrCreateOne(RoleType.Student, "Student");
              if (!role)
                return next({ message: "Cannot get or create a valid role entry for 'Student'" });
            } else if (email.endsWith("@unive.it")) {
              // Professor
              role = await this.rolesRepository.getOrCreateOne(RoleType.Professor, "Professor");
              if (!role)
                return next({ message: "Cannot get or create a valid role entry for 'Professor'" });
            } else {
              return next({ message: "Operation not supported. Only members of @unive can use this service." });
            }

            // Create the new user
            const newUser = await this.usersRepository.update({
              authType: AuthType.Google,
              email: email,
              googleId: profile.id,
              name: profile.displayName,
              registrationDate: new Date(),
              image: photo,
              role: role._id as any // To assign the reference
            } as IUser);

            if (!newUser)
              return next({ message: "Unknown error occur while creating the new user." });

            // Return the new user
            userData = {
              user: newUser.toJSON(),
              isNew: true
            };
            next(null, userData);
          } catch (error) {
            // Return the error
            next(error);
          }
        })
    );


    this.router.post('/google', async (req, res, next) => {
      passport.authenticate('google-plus-token', function (error, userData: { user: User, isNew: boolean }) {
        if (error)
          return new ApiResponse({
            response: res,
            httpCode: 401,
            exception: error
          }).send();

        if (!userData)
          return new ApiResponse({
            response: res,
            httpCode: 400,
            exception: {
              message: "Invalid parameter 'access_token'"
            }
          }).send();

        return new ApiResponse({
          response: res,
          httpCode: 200,
          data: {
            user: userData.user,
            isNew: userData.isNew,
            token: sign(userData.user, environment.jwtSecret)
          }
        }).send();
      })(req, res);
    });

    return this;
  }

  /**
   * Return true if the given token is valid
   */
  private useTokenValidate() {
    this.router.post('/token/validate', async (req, res, next) => {
      const token = req.body.token;
      if (token) {

        const isValid = AuthenticationController.ValidateToken(token);

        if (isValid)
          return new ApiResponse({
            response: res,
            httpCode: 200,
            data: true
          }).send();
        else
          return new ApiResponse({
            response: res,
            httpCode: 200,
            data: false
          }).send();
      } else {
        return new ApiResponse({
          response: res,
          httpCode: 400,
          exception: "Bad request, missing 'token' parameter"
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
          message: "Route not found",
          url: req.url
        } as any,
        httpCode: 404,
        response: res,
      }).send();
    });
    return this;
  }
}