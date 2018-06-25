import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { InternshipsProposalsRepository, CompaniesRepository, InternshipsRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IInternshipProposal } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";
import { InternshipProposalStatusType, InternshipProposal, User, Company, InternshipStatusType } from "thesis-dais-internship-manager-core";
import { ownInternshipProposal, adminScope } from "../utils/auth/scopes";
import { InternshipProposalStatusTypeMachine } from "../utils/state-machines/internship-proposal-status.type.machine";
import { ServerDefaults } from "../ServerDefaults";
import { InternshipProposalModel } from "../schemas/internship-proposal.schema";
import { generateInternshipProposalTemplate } from "../utils/pdf-generation/internship-proposal.template";
import { PdfGenerator } from "../utils/pdf-generation/pdf-generator.util";

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
      .useListStates()
      .useAddAttendance()
      .useGenerateDocs();
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

      // Set startDate once started
      if (newState === InternshipProposalStatusType.Started)
        update.startDate = new Date();

      // Set end date once Ended,Canceled or rejected
      if (newState === InternshipProposalStatusType.Ended ||
        newState === InternshipProposalStatusType.Canceled ||
        newState === InternshipProposalStatusType.RejectedByCompany ||
        newState === InternshipProposalStatusType.RejectedByProfessor)
        update.endDate = new Date();

      const result = await this.internshipProposalsRepository
        .partialUpdate(update.id, {
          status: newState,
          startDate: update.startDate,
          endDate: update.endDate
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


  /**
   * Add a list of attendances to a internship proposal
   *  
   * ***POST*** 
   * 
   * /internshipProposals/addAttendances
   * 
   * ***Body parameters***
   * ```
   * {
   *    attendances: Array<Attendance>,
   *    internshipProposalId: string
   * }```
   * 
   * @return ApiResponse<InternshipProposal>
   */
  private useAddAttendance() {
    this.router.post('/addAttendances', async (req, res) => {
      try {
        const attendances = req.body.attendances;
        const internshipProposalId = req.body.internshipProposalId;

        if (!attendances) {
          return new ApiResponse({
            data: null,
            httpCode: 400,
            response: res,
            exception: {
              message: "Bad request. Request body is empty, missing 'status' parameter"
            }
          }).send();
        }


        //  Get proposal
        const proposal = await this.internshipProposalsRepository.get(internshipProposalId);

        // Get user
        const user: User = req.body[ServerDefaults.authUserBodyPropertyName];

        // Check if the user is related to the internship proposal
        // The user is the student
        if (proposal.student.id !== user.id &&
          // or the professor
          proposal.professor.id !== user.id &&
          // or the company owner
          !proposal.internship.company.owners.find(o => o.id === user.id)) {

          return new ApiResponse({
            data: null,
            httpCode: 401,
            response: res,
            exception: {
              code: "auth/user-unauthorized",
              message: "You cannot add an attendance of an internship proposal you are not in"
            }
          }).send();
        }

        // Ok, push and update
        proposal.attendances = proposal.attendances || [];
        proposal.attendances.push(...attendances);

        return new ApiResponse({
          data: await proposal.save(),
          httpCode: 200,
          response: res
        }).send();

      } catch (ex) {
        return new ApiResponse({
          data: null,
          httpCode: 500,
          response: res,
          exception: ex
        }).send();
      }
    });
    return this;
  }

  /**
   * Create the documentation at the end of an InternshipProposal
   *  
   * ***GET*** 
   * 
   * /internshipProposals/generateDocs/${internshipProposalId}
   * 
   * ***Query parameters***
   * ```
   * {
   *    internshipProposalId: string
   * }```
   * 
   * @return PDF Stream
   */
  private useGenerateDocs() {
    this.router.get('/generateDocs/:internshipProposalId', async (req, res) => {
      try {
        const internshipProposalId = req.params.internshipProposalId;

        if (!internshipProposalId) {
          return new ApiResponse({
            data: null,
            httpCode: 400,
            response: res,
            exception: {
              message: "Bad request. Missing 'internshipProposalId' parameter"
            }
          }).send();
        }


        //  Get proposal
        const proposal = await this.internshipProposalsRepository.get(internshipProposalId);

        // Get user
        const user: User = req.body[ServerDefaults.authUserBodyPropertyName];

        // Check if the user is related to the internship proposal
        // The user is the student
        if (proposal.student.id !== user.id &&
          // or the professor
          proposal.professor.id !== user.id &&
          // or the company owner
          !proposal.internship.company.owners.find(o => o.id === user.id)) {

          return new ApiResponse({
            data: null,
            httpCode: 401,
            response: res,
            exception: {
              code: "auth/user-unauthorized",
              message: "You cannot generate documentation of an internship proposal you are not in"
            }
          }).send();
        }

        PdfGenerator.generateAndSend(generateInternshipProposalTemplate(proposal), res);

      } catch (ex) {
        return new ApiResponse({
          data: null,
          httpCode: 500,
          response: res,
          exception: ex
        }).send();
      }
    });
    return this;
  }
}