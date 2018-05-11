import { Request, Response, Router } from "express";
import { injectable, inject } from "inversify";
import { types } from "../utils/di-types";
import { BaseController } from "./base/base.controller";
import { ApiResponse } from "../models/api-response.model";
import * as nodemailer from 'nodemailer';
import { ServerDefaults } from "../ServerDefaults";
import { environment } from "../environment";

/**
 * The Emails controller
 */
@injectable()
export class EmailsController {

  /** The express router */
  private router: Router = Router();

  /**
   * Create the controller that handles authentication
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    @inject(types.App) private app: any) {

  }

  /**
 * Register this controller routes
 * @param useAllCustom Indicates if the custom routes should be registred automatically [default true]
 */
  public register() {
    this
      .useAuth()
      .useSend();

    this.app.use(`${ServerDefaults.apiBaseUrl}/emails`, this.router);

    return this;
  }

  /**
 * Enable JWT token verification. Every method called after this call will use authentication
 * 
 * A user scope can be specified using a scope middleware.
 */
  public useAuth() {
    this.router.use('*', BaseController.AuthMiddleware);
    return this;
  }

  /**
   * Decodes the information about the given token
   */
  private useSend() {
    this.router.post('/send', async (req, res, next) => {
      try {

        const destinations = req.body.to.join(',');
        const subject = req.body.subject;
        const text = req.body.text;
        const html = req.body.html;

        if (!destinations || !subject) {
          return new ApiResponse({
            response: res,
            httpCode: 400,
            exception: {
              message: "Bad request. Missing 'to' or 'subject' properties"
            }
          }).send();
        }

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: environment.email.host,
          port: environment.email.port,
          service: environment.email.service,
          auth: {
            user: environment.email.auth.user,
            pass: environment.email.auth.password
          },
          secure: true
        });

        // setup email data with unicode symbols
        const mailOptions = {
          from: `"DAIS Internship Manager" <${environment.email.auth.user}>`, // sender address
          to: destinations,
          subject: subject,
          text: text, // plain text body
          html: html // html body
        };

        const result = await transporter.sendMail(mailOptions);

        return new ApiResponse({
          response: res,
          httpCode: 200,
          data: result
        }).send();

      } catch (ex) {
        return new ApiResponse({
          response: res,
          httpCode: 500,
          exception: ex
        }).send();
      }
    });

    return this;
  }

}