import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company, Defaults, InternshipProposal, InternshipProposalStatusType } from "gdl-thesis-core/dist";

@injectable()
export class InternshipProposalService extends BaseService {


    create(internshipProposal: InternshipProposal): Promise<ApiResponseDto<InternshipProposal>> {
        return this.postVerb(Defaults.collectionsName.internshipProposals, internshipProposal);
    }

    getPendingStudents(professorId: string): Promise<ApiResponseDto<Array<InternshipProposal>>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/pendingstudents/' + professorId);
    }

    getByStudentId(studentId: string): Promise<ApiResponseDto<Array<InternshipProposal>>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/getByStudentId/' + studentId);
    }

    getAvailablePlace(internshipId: string): Promise<ApiResponseDto<number>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/availableplaces/' + internshipId);
    }


    getById(internshipProposalId: string): Promise<ApiResponseDto<InternshipProposal>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/' + internshipProposalId);
    }


    async updateStatus(internshipId: string, newState: InternshipProposalStatusType): Promise<ApiResponseDto<InternshipProposal>> {
        return this.putVerb(`${Defaults.collectionsName.internshipProposals}/status`, {
            id: internshipId,
            status: newState
        });
    }

    async forceUpdateStatus(internshipId: string, newState: InternshipProposalStatusType): Promise<ApiResponseDto<InternshipProposal>> {
        return this.putVerb(`${Defaults.collectionsName.internshipProposals}/status/force`, {
            id: internshipId,
            status: newState
        });
    }
}