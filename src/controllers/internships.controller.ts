import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { CompaniesRepository, InternshipsRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IInternship } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";

/**
 * The [[Internship]] controller
 */
@injectable()
export class InternshipsController extends BaseController<IInternship> {

  /**
   * Create the controller that handles routes
   * @param internshipsRepository The companies repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    private internshipsRepository: InternshipsRepository,
    @inject(types.App) app: Express.Application) {

    super(internshipsRepository, app);
  }

  /**
     * Return the list of all internships inserted by companies
     * in which owners contain the given ownerId
   */
  public useGetByCompanyOwnerId() {
    this.router.get('/getByCompanyOwnerId/:ownerId', async (req, res) => {
      const ownerId: string = req.params.ownerId;

      if (ownerId) {
        return this.internshipsRepository.getByCompanyOwnerId(ownerId)
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