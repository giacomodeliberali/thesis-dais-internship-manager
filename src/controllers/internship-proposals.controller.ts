import { Request, Response, Router } from "express";
import { BaseController } from "./base/base.controller";
import { inject, injectable } from "inversify";
import { InternshipsProposalsRepository } from "../repositories";
import { types } from "../utils/di-types";
import { IInternshipProposal } from "../models/interfaces";
import { ApiResponse } from "../models/api-response.model";
import { InternshipProposalStatusType } from "gdl-thesis-core/dist";

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
      .useGetAvailablePlaces();
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
}