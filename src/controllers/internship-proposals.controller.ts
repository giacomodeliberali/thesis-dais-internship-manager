import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { InternshipsProposalsRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IInternshipProposal } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";
import { InternshipProposalStatusType, InternshipProposal, User } from "gdl-thesis-core/dist";
import { ownInternshipProposal, adminScope } from "../utils/auth/scopes";
import { InternshipProposalStatusTypeMachine } from "../utils/state-machines/internship-proposal-status.type.machine";
import { ServerDefaults } from "../ServerDefaults";

/**
 * The [[InternshipProposal]] controller
 */
@injectable()
export class InternshipProposalsController extends BaseController<IInternshipProposal> {

  /**
   * Create the controller that handles routes
   * @param internshipProposalsRepository The companies repository
   * @param app The express application used to register a new route for this controller
   */
  constructor(
    private internshipProposalsRepository: InternshipsProposalsRepository,
    @inject(types.App) app: Express.Application) {

    super(internshipProposalsRepository, app);
  }

  public useCustoms() {
    return this
      .useGetPendingStudents()
      .useGetAvailablePlaces()
      .useGetByStudentId()
      .useUpdateStates()
      .useForceUpdateStates()
      .useListStates();
  }

  /**
   * Return the list of [[InternshipProposal]] waiting for a response from the given professor id
   */
  private useGetPendingStudents() {

    this.router.get('/pendingstudents/:id', async (req, res) => {
      const professorId: string = req.params.id;

      const proposals = await this.internshipProposalsRepository.find({
        professor: professorId as any,
        status: InternshipProposalStatusType.WaitingForProfessor
      });

      if (professorId) {
        return new ApiResponse({
          data: proposals,
          httpCode: 200,
          response: res
        }).send();
      } else {
        return new ApiResponse({
          exception: {
            message: "Bad request. Missing 'id' parameter"
          },
          httpCode: 400,
          response: res
        }).send();
      }
    });
    return this;
  }

  /**
   * Return the list of [[InternshipProposal]] created by the given student id
   */
  private useGetByStudentId() {

    this.router.get('/getByStudentId/:id', async (req, res) => {
      const studentId: string = req.params.id;

      const proposals = await this.internshipProposalsRepository.find({
        student: studentId as any
      });

      if (studentId) {
        return new ApiResponse({
          data: proposals,
          httpCode: 200,
          response: res
        }).send();
      } else {
        return new ApiResponse({
          exception: {
            message: "Bad request. Missing 'id' parameter"
          },
          httpCode: 400,
          response: res
        }).send();
      }
    });
    return this;
  }

  /**
   * Return the number of available place in an [[Internship]]
   */
  private useGetAvailablePlaces() {

    this.router.get('/availableplaces/:id', async (req, res) => {
      const internshipId: string = req.params.id;

      const count = await this.internshipProposalsRepository.getAvailablePlaces(internshipId);

      if (internshipId) {
        return new ApiResponse({
          data: count,
          httpCode: 200,
          response: res
        }).send();
      } else {
        return new ApiResponse({
          exception: {
            message: "Bad request. Missing 'id' parameter"
          },
          httpCode: 400,
          response: res
        }).send();
      }
    });
    return this;
  }

  /**
 * Update the state of an [[Internship]] following the [[InternshipStatusTypeMachine]] transition function
 */
  private useUpdateStates() {
    this.router.put('/status', [ownInternshipProposal], async (req, res) => {
      const internshipProposalId = req.body.id;
      const newState: InternshipProposalStatusType = req.body.status;

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
      const internshipProposal = await this.internshipProposalsRepository.get(internshipProposalId);

      if (!internshipProposal) {
        return new ApiResponse({
          data: null,
          httpCode: 404,
          response: res,
          exception: {
            message: `Cannot find a internship matching the id '${internshipProposalId}'`
          }
        }).send();
      }

      // Check the state transition

      const stateMachine = new InternshipProposalStatusTypeMachine(internshipProposal.status);

      if (!stateMachine.can(newState)) {
        return new ApiResponse({
          data: null,
          httpCode: 400,
          response: res,
          exception: {
            message: `Cannot update the internship status from ${InternshipProposalStatusType[internshipProposal.status]} to ${InternshipProposalStatusType[newState]}`
          }
        }).send();
      }

      const update = new InternshipProposal(internshipProposal.toObject());
      update.status = newState;

      return this.internshipProposalsRepository
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
  private useForceUpdateStates() {
    this.router.put('/status/force', [adminScope], async (req, res) => {
      const newState: InternshipProposalStatusType = req.body.status;
      const id = req.body.id;

      if (newState !== undefined && newState !== null) {
        return this.internshipProposalsRepository
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
  private useListStates() {
    this.router.get('/status/:state', async (req, res) => {
      const currentState = req.params.state;
      if (currentState !== undefined && currentState !== null) {

        const stateMachine = new InternshipProposalStatusTypeMachine(currentState);

        const user: User = req.body[ServerDefaults.authUserBodyPropertyName];
        return new ApiResponse({
          data: stateMachine.getAvailableStates(user.role.type),
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