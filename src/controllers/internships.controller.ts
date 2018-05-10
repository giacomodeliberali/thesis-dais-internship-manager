import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { CompaniesRepository, InternshipsRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IInternship } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";
import { InternshipStatusTypeMachine } from "../utils/state-machines/internship-status.type.machine";
import { InternshipStatusType, Internship } from "gdl-thesis-core/dist";

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

  /**
   * Return all the Approved internships
   */
  public useGetApproved() {
    this.router.get('/getApproved', async (req, res) => {
      return this.internshipsRepository.getApproved()
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
   * Update the state of an [[Internship]] following the [[InternshipStatusTypeMachine]] transition function
   */
  public useUpdateStates() {
    this.router.put('/status', async (req, res) => {
      const internshipId = req.body.id;
      const newState: InternshipStatusType = req.body.status;

      if (newState === undefined && newState === null) {
        return new ApiResponse({
          data: null,
          httpCode: 400,
          response: res,
          exception: {
            message: "Bad request. Request body is empty, missing 'status' parameter"
          }
        }).send();
      }

      // Get the internship
      const internship = await this.internshipsRepository.get(internshipId);

      if (!internship) {
        return new ApiResponse({
          data: null,
          httpCode: 404,
          response: res,
          exception: {
            message: `Cannot find a internship matching the id '${internshipId}'`
          }
        }).send();
      }

      // Check the state transition

      const stateMachine = new InternshipStatusTypeMachine(internship.status);

      if (!stateMachine.can(newState)) {
        return new ApiResponse({
          data: null,
          httpCode: 400,
          response: res,
          exception: {
            message: `Cannot update the internship status from ${InternshipStatusType[internship.status]} to ${InternshipStatusType[newState]}`
          }
        }).send();
      }

      const update = new Internship(internship.toObject());
      update.status = newState;

      return this.internshipsRepository
        .partialUpdate({
          status: newState,
          id: update.id
        })
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
   * Update the state of an [[Internship]] WITHOUT the constraint of the [[InternshipStatusTypeMachine]] transition function
   */
  public useForceUpdateStates() {
    this.router.put('/status/force', async (req, res) => {
      const newState: InternshipStatusType = req.body.status;
      const id = req.body.id;

      if (newState !== undefined && newState !== null) {
        return this.internshipsRepository
          .partialUpdate({
            status: newState,
            id: id
          })
          .then(result => {
            return new ApiResponse({
              data: result,
              httpCode: 200,
              response: res
            }).send();
          });
      } else {
        return new ApiResponse({
          data: null,
          httpCode: 400,
          response: res,
          exception: {
            message: "Bad request. Request body is empty, missing 'status' parameter"
          }
        }).send();
      }
    });
    return this;
  }

  /**
   * Given a [[InternshipsStatusType]] return all the available states
   */
  public useListStates() {
    this.router.get('/status/:state', async (req, res) => {
      const currentState = req.params.state;
      if (currentState !== undefined && currentState !== null) {

        const stateMachine = new InternshipStatusTypeMachine(currentState);

        return new ApiResponse({
          data: stateMachine.getAvailableStates(),
          httpCode: 200,
          response: res
        }).send();
      } else {
        return new ApiResponse({
          data: null,
          httpCode: 400,
          response: res,
          exception: {
            message: "Bad request. Request body is empty, missing 'status' parameter"
          }
        }).send();
      }
    });
    return this;
  }
}