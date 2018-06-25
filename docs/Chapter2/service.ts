/**
 * The [[InternshipProposal]] service
 * 
 * @extends {BaseService}
 */
@injectable()
export class InternshipProposalService extends BaseService {

    /**
     * Return a list af all proposals that 
     * reference the given professor id
     *
     * @param {string} professorId The professor id
     */
    getByProfessorId(professorId: string): 
        Promise<ApiResponseDto<Array<InternshipProposal>>> {

        return this.getVerb(
            `${Defaults.collectionsName.internshipProposals}/getByProfessorId/${professorId}`
        );
    }

    // ...
}