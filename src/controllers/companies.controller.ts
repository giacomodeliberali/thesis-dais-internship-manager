import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { CompaniesRepository } from "../repositories";
import { types } from "../utils/di-types";
import { ICompany } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";

/**
 * The [[Company]] controller
 */
@injectable()
export class CompaniesController extends BaseController<ICompany> {

  /**
   * Create the controller that handles routes
   * @param companiesRepository The companies repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    private companiesRepository: CompaniesRepository,
    @inject(types.App) app: Express.Application) {

    super(companiesRepository, app);
  }

  public useCustoms() {
    return this.useGetByOwnerId();
  }

  /**
   * Return the list of companies of the given userId
   */
  private useGetByOwnerId() {
    this.router.get('/getByOwnerId/:ownerId', async (req, res) => {
      const ownerId: string = req.params.ownerId;

      if (ownerId) {
        // The user to update is the same as token
        return this.companiesRepository.getByOnwerId(ownerId).then(result => {
          return new ApiResponse({
            data: result,
            httpCode: 200,
            response: res
          }).send();
        });
      } else {
        return new ApiResponse({
          exception: {
            message: "Missing required parameter 'ownerId'",
            code: "request/bad-params"
          },
          httpCode: 400,
          response: res
        }).send();
      }
    });
    return this;
  }

}