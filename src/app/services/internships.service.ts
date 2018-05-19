import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, InternshipStatusType } from "gdl-thesis-core/dist";

@injectable()
export class InternshipsService extends BaseService {

    getAll(): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb('internships');
    }

    create(internship: Internship): Promise<ApiResponseDto<Internship>> {
        return this.postVerb('internships', internship);
    }

    update(internship: Internship): Promise<ApiResponseDto<Internship>> {
        return this.putVerb('internships', internship);
    }

    getById(id: string): Promise<ApiResponseDto<Internship>> {
        return this.getVerb(`internships/${id}`);
    }

    getByCompanyOwnerId(id: string): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb(`internships/getByCompanyOwnerId/${id}`);
    }

    getApproved(): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb('internships/getApproved');
    }

    getNotApproved(): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb('internships/getNotApproved');
    }

    delete(id: string): Promise<ApiResponseDto<boolean>> {
        return this.deleteVerb(`internships/${id}`);
    }

    /**
     * Get all the available state based on the current token role
     * @param newState The current state
     */
    async getAvailableStates(newState: InternshipStatusType): Promise<Array<{ text: string, value: InternshipStatusType }>> {
        const result = await this.getVerb(`internships/status/${newState}`);

        if (result && result.isOk)
            return result.data;

        return [];
    }

    async updateStatus(
        internshipId: string,
        newState: InternshipStatusType,
        rejectReason?: string): Promise<ApiResponseDto<Internship>> {

        return this.putVerb(`internships/status`, {
            id: internshipId,
            status: newState,
            rejectReason: rejectReason
        });


    }
}