import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { InternshipsProposalsRepository, CompaniesRepository, InternshipsRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IInternshipProposal } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";
import { InternshipProposalStatusType, InternshipProposal, User, Company, InternshipStatusType } from "gdl-thesis-core/dist";
import { ownInternshipProposal, adminScope } from "../utils/auth/scopes";
import { InternshipProposalStatusTypeMachine } from "../utils/state-machines/internship-proposal-status.type.machine";
import { ServerDefaults } from "../ServerDefaults";
import { InternshipProposalModel } from "../schemas/internship-proposal.schema";

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
    @inject(types.App) app: Express.Application,
    private companiesRepository: CompaniesRepository,
    private internshipsRepository: InternshipsRepository) {

    super(internshipProposalsRepository, app);
  }

  public useCustoms() {
    return this
      .useGetByProfessorId()
      .useGetAvailablePlaces()
      .useGetByStudentId()
      .useGetByCompanyOwnerId()
      .useUpdateStates()
      .useForceUpdateStates()
      .useListStates();
  }

  /**
   * Return the list of [[InternshipProposal]] that reference the given professor id
   */
  private useGetByProfessorId() {

    this.router.get('/getByProfessorId/:id', async (req, res) => {
      const professorId: string = req.params.id;

      const proposals = await this.internshipProposalsRepository.find({
        professor: professorId as any
      }).sort([['status', 'ascending']]);

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
   * Return the list of [[InternshipProposal]] that reference at least one company of the given user id
   */
  private useGetByCompanyOwnerId() {

    this.router.get('/getByCompanyOwnerId/:id', async (req, res) => {
      try {
        const companyOwnerId: string = req.params.id;

        if (!companyOwnerId)
          return new ApiResponse({
            exception: {
              message: "Bad request. Missing 'id' parameter"
            },
            httpCode: 400,
            response: res
          }).send();

        // Get all companies of the given user id
        const companies = await this.companiesRepository.getByOwnerId(companyOwnerId);

        // Get all proposals 
        // TODO: make a nested query with populate, but how?
        let proposals = await this.internshipProposalsRepository.find();

        // Filter only proposals in which the company id is one of the above
        proposals = proposals.filter(p => {
          const companiesIds = companies.map(c => c.id);
          return !!companiesIds.find(c => c === p.internship.company.id);
        });

        return new ApiResponse({
          data: proposals,
          httpCode: 200,
          response: res
        }).send();

      } catch (ex) {
        return new ApiResponse({
          exception: ex,
          httpCode: 500,
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

      // Update the proposal
      const update: InternshipProposal = new InternshipProposal(internshipProposal.toObject());
      update.status = newState;

      const result = await this.internshipProposalsRepository
        .partialUpdate(update.id, {
          status: newState
        });

      // Check remaining places for the related internship
      const availablePlaces = await this.internshipProposalsRepository.getAvailablePlaces(update.internship.id);

      // If no more free spaces change the internship status to Closed
      if (availablePlaces === 0)
        await this.internshipsRepository
          .partialUpdate(update.internship.id, {
            status: InternshipStatusType.Closed
          });

      // Return the updated internship proposal
      return new ApiResponse({
        data: result,
        httpCode: 200,
        response: res
      }).send();

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

        // Update the proposal
        const result = await this.internshipProposalsRepository
          .partialUpdate(id, {
            status: newState
          });

        // Check remaining places for the related internship
        const internshipProposal = await this.internshipProposalsRepository.get(id);
        const availablePlaces = await this.internshipProposalsRepository.getAvailablePlaces(internshipProposal.internship.id);

        // If no more free spaces change the internship status to Closed
        if (availablePlaces === 0)
          await this.internshipsRepository
            .partialUpdate(internshipProposal.internship.id, {
              status: InternshipStatusType.Closed
            });

        // Return the updated internship proposal
        return new ApiResponse({
          data: result,
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