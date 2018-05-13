import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company, Defaults, InternshipProposal } from "gdl-thesis-core/dist";

@injectable()
export class InternshipProposalService extends BaseService {


    create(internshipProposal: InternshipProposal): Promise<ApiResponseDto<InternshipProposal>> {
        return this.postVerb(Defaults.collectionsName.internshipProposals, internshipProposal);
    }

    getPendingStudents(professorId: string): Promise<ApiResponseDto<Array<InternshipProposal>>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/pendingstudents/' + professorId);
    }
}