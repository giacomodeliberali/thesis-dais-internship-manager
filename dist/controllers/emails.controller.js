"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const di_types_1 = require("../utils/di-types");
const api_response_model_1 = require("../models/api-response.model");
const nodemailer = require("nodemailer");
const ServerDefaults_1 = require("../ServerDefaults");
const environment_1 = require("../environment");
const authentication_controller_1 = require("./authentication.controller");
/**
 * The Emails controller
 */
let EmailsController = class EmailsController {
    /**
     * Create the controller that handles authentication
     * @param app The express application used to register a new route for this controller
     */
    constructor(app) {
        this.app = app;
        /** The express router */
        this.router = express_1.Router();
    }
    /**
   * Register this controller routes
   * @param useAllCustom Indicates if the custom routes should be registred automatically [default true]
   */
    register() {
        this
            .useAuth()
            .useSend();
        this.app.use(`${ServerDefaults_1.ServerDefaults.apiBaseUrl}/emails`, this.router);
        return this;
    }
    /**
   * Enable JWT token verification. Every method called after this call will use authentication
   *
   * A user scope can be specified using a scope middleware.
   */
    useAuth() {
        this.router.use('*', authentication_controller_1.AuthenticationController.AuthMiddleware);
        return this;
    }
    /**
     * Decodes the information about the given token
     */
    useSend() {
        this.router.post('/send', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const destinations = req.body.to.join(',');
                const subject = req.body.subject;
                const text = req.body.text;
                const html = req.body.html;
                if (!destinations || !subject) {
                    return new api_response_model_1.ApiResponse({
                        response: res,
                        httpCode: 400,
                        exception: {
                            message: "Bad request. Missing 'to' or 'subject' properties"
                        }
                    }).send();
                }
                // create reusable transporter object using the default SMTP transport
                const transporter = nodemailer.createTransport({
                    host: environment_1.environment.email.host,
                    port: environment_1.environment.email.port,
                    service: environment_1.environment.email.service,
                    auth: {
                        user: environment_1.environment.email.auth.user,
                        pass: environment_1.environment.email.auth.password
                    },
                    secure: true
                });
                // setup email data with unicode symbols
                const mailOptions = {
                    from: `"DAIS Internship Manager" <${environment_1.environment.email.auth.user}>`,
                    to: destinations,
                    subject: subject,
                    text: text,
                    html: html // html body
                };
                const result = yield transporter.sendMail(mailOptions);
                return new api_response_model_1.ApiResponse({
                    response: res,
                    httpCode: 200,
                    data: result
                }).send();
            }
            catch (ex) {
                return new api_response_model_1.ApiResponse({
                    response: res,
                    httpCode: 500,
                    exception: ex
                }).send();
            }
        }));
        return this;
    }
};
EmailsController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(di_types_1.types.App)),
    __metadata("design:paramtypes", [Object])
], EmailsController);
exports.EmailsController = EmailsController;
//# sourceMappingURL=emails.controller.js.map