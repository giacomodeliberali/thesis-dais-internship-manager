import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "./auth.service";
import { injectable } from "inversify";
import { ApiResponseDto } from "gdl-thesis-core/dist";

/**
 * A base service that exposes standard verbs
 */
@injectable()
export class BaseService {

    /**
     * Inject all deps
     * @param httpClient The http client
     * @param authService The authentication service
     */
    constructor(
        private httpClient: HttpClient,
        private authService: AuthService) {

    }

    /**
     * Make a PUT request to the specified path
     * @param path The path
     * @param body The request body
     */
    protected putVerb(path: string, body: any) {
        return this.httpClient.put(`${environment.apiServicesBaseUrl}/${path}`, body, {
            headers: {
                "Authentication": this.authService.token || ''
            }
        }).toPromise() as Promise<any>;
    }

    /**
     * Make a POST request to the specified path
     * @param path The path
     * @param body The request body
     */
    protected postVerb(path: string, body: any) {
        return this.httpClient.post(`${environment.apiServicesBaseUrl}/${path}`, body, {
            headers: {
                "Authentication": this.authService.token || ''
            }
        }).toPromise() as Promise<any>;
    }

    /**
     * Make a GET request to the specified path
     * @param path The path
     */
    protected getVerb(path: string) {
        return this.httpClient.get(`${environment.apiServicesBaseUrl}/${path}`, {
            headers: {
                "Authentication": this.authService.token || ''
            }
        }).toPromise() as Promise<ApiResponseDto<any>>;
    }

    /**
     * Make a DELETE request to the specified path
     * @param path The path
     */
    protected deleteVerb(path: string) {
        return this.httpClient.delete(`${environment.apiServicesBaseUrl}/${path}`, {
            headers: {
                "Authentication": this.authService.token || ''
            }
        }).toPromise() as Promise<any>;
    }
}