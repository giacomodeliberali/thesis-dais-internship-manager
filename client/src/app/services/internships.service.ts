import { BaseService } from "./base.service";
import { injectable } from "inversify";
import { User, ApiResponseDto, Internship, InternshipStatusType, Defaults } from "thesis-dais-internship-manager-core";
/**
 * The internships service
 *
 * @extends {BaseService}
 */
@injectable()
export class InternshipsService extends BaseService {

    /**
     * Get all internships
     */
    getAll(): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb(Defaults.collectionsName.internships);
    }

    /**
     * Create a new internship
     *
     * @param {Internship} internship The new internship
     */
    create(internship: Internship): Promise<ApiResponseDto<Internship>> {
        return this.postVerb(Defaults.collectionsName.internships, internship);
    }

    /**
     * Update an existing internship
     *
     * @param {Internship} internship The internship to update
     */
    update(internship: Internship): Promise<ApiResponseDto<Internship>> {
        return this.putVerb(Defaults.collectionsName.internships, internship);
    }

    /**
     * Return an internship by its identifier
     *
     * @param {string} id The internship identifier
     */
    getById(id: string): Promise<ApiResponseDto<Internship>> {
        return this.getVerb(`${Defaults.collectionsName.internships}/${id}`);
    }

    /**
     * Return all the internships created by the given company id
     *
     * @param {string} id The company id
     */
    getByCompanyOwnerId(id: string): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb(`${Defaults.collectionsName.internships}/getByCompanyOwnerId/${id}`);
    }

    /**
     * Return the list of all approved internships
     */
    getApproved(): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb(`${Defaults.collectionsName.internships}/getApproved`);
    }

    /**
     * Return the list of all not approved internships
     */
    getNotApproved(): Promise<ApiResponseDto<Array<Internship>>> {
        return this.getVerb(`${Defaults.collectionsName.internships}/getNotApproved`);
    }

    /**
     * Delete an internship by its identifier
     *
     * @param {string} id The internship identifier
     */
    delete(id: string): Promise<ApiResponseDto<boolean>> {
        return this.deleteVerb(`${Defaults.collectionsName.internships}/${id}`);
    }

    /**
     * Get all the available state based on the current token role
     * @param {InternshipStatusType} newState The current state
     */
    async getAvailableStates(newState: InternshipStatusType): Promise<Array<{ text: string, value: InternshipStatusType }>> {
        const result = await this.getVerb(`${Defaults.collectionsName.internships}/status/${newState}`);

        if (result && result.isOk)
            return result.data;

        return [];
    }

    /**
     * Update the status af an internship following the state machine transition function
     * 
     * @param {string} internshipId The internship identifier
     * @param {InternshipStatusType} newState The new state
     * @param {string} [rejectReason] The reject reason (if the new state is Rejected)
     */
    async updateStatus(
        internshipId: string,
        newState: InternshipStatusType,
        rejectReason?: string): Promise<ApiResponseDto<Internship>> {

        return this.putVerb(`${Defaults.collectionsName.internships}/status`, {
            id: internshipId,
            status: newState,
            rejectReason: rejectReason
        });


    }
}
