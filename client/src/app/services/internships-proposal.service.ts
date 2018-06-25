import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, Company, Defaults, InternshipProposal, InternshipProposalStatusType, Attendance } from "gdl-thesis-core/dist";
/**
 * The internship proposal service
 * 
 * @extends {BaseService}
 */
@injectable()
export class InternshipProposalService extends BaseService {

    /**
     * Create a new internship proposal
     * 
     * @param {InternshipProposal} internshipProposal The new proposal
     */
    create(internshipProposal: InternshipProposal): Promise<ApiResponseDto<InternshipProposal>> {
        return this.postVerb(Defaults.collectionsName.internshipProposals, internshipProposal);
    }

    /**
     * Return a list af all proposals that reference the given professor id
     *
     * @param {string} professorId The professor id
     */
    getByProfessorId(professorId: string): Promise<ApiResponseDto<Array<InternshipProposal>>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/getByProfessorId/' + professorId);
    }

    /**
     * Return the list internship proposal made by the given student id
     *
     * @param {string} studentId The student id
     */
    getByStudentId(studentId: string): Promise<ApiResponseDto<Array<InternshipProposal>>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/getByStudentId/' + studentId);
    }

    /**
     * Return a list af all proposals that reference the given company owner id
     *
     * @param {string} companyOwnerId The company owner id
     */
    getByCompanyOwnerId(companyOwnerId: string): Promise<ApiResponseDto<Array<InternshipProposal>>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/getByCompanyOwnerId/' + companyOwnerId);
    }


    /**
     * Return the number of available places for the given internship
     * 
     * @param {string} internshipId The internship identifier
     */
    getAvailablePlace(internshipId: string): Promise<ApiResponseDto<number>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/availableplaces/' + internshipId);
    }

    /**
     * Return a proposal by its identifier
     *
     * @param {string} internshipProposalId The proposal identifier
     */
    getById(internshipProposalId: string): Promise<ApiResponseDto<InternshipProposal>> {
        return this.getVerb(Defaults.collectionsName.internshipProposals + '/' + internshipProposalId);
    }

    /**
     * Update the status of an internship proposal following the state machine transition function
     *
     * @param {string} internshipId The internship proposal to update
     * @param {InternshipProposalStatusType} newState The new state that follows the machine state transition function
     */
    async updateStatus(internshipId: string, newState: InternshipProposalStatusType): Promise<ApiResponseDto<InternshipProposal>> {
        return this.putVerb(`${Defaults.collectionsName.internshipProposals}/status`, {
            id: internshipId,
            status: newState
        });
    }

    /**
     * Update the status of an internship proposal without following the state machine transition function
     *
     * @param {string} internshipId The internship proposal to update
     * @param {InternshipProposalStatusType} newState The new state
     */
    async forceUpdateStatus(internshipId: string, newState: InternshipProposalStatusType): Promise<ApiResponseDto<InternshipProposal>> {
        return this.putVerb(`${Defaults.collectionsName.internshipProposals}/status/force`, {
            id: internshipId,
            status: newState
        });
    }

    /**
     * Add the list of attendances to the internship proposal
     *
     * @param {string} internshipProposalId The internship proposal id
     * @param {Array<Attendance>} attendances The list of attendances to add
     */
    addAttendances(internshipProposalId: string, attendances: Array<Attendance>): Promise<ApiResponseDto<InternshipProposal>> {
        return this.postVerb(`${Defaults.collectionsName.internshipProposals}/addAttendances`, {
            internshipProposalId: internshipProposalId,
            attendances: attendances
        });
    }

    /**
     * Generate the documentation for an ended internship proposal
     *
     * @param {string} internshipProposalId The internship identifier
     * @returns {Promise<string>} The resulting PDF url
     */
    generateDocs(internshipProposalId: string): Promise<Blob> {
        return this.getVerb(`${Defaults.collectionsName.internshipProposals}/generateDocs/${internshipProposalId}`, {
            responseType: 'arraybuffer'
        }).then(response => {
            return new Blob([response], { type: 'application/pdf' });
        });
    }
}