import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "./auth.service";
import { injectable } from "inversify";

@injectable()
export class BaseService {


    constructor(
        private httpClient: HttpClient,
        private authService: AuthService) {

    }

    protected put(path: string, body: any) {
        return this.httpClient.put(`${environment.apiServicesBaseUrl}/${path}`, body, {
            headers: {
                "Authentication": this.authService.token
            }
        }).toPromise();
    }

    protected post(path: string, body: any) {
        return this.httpClient.post(`${environment.apiServicesBaseUrl}/${path}`, body, {
            headers: {
                "Authentication": this.authService.token
            }
        }).toPromise();
    }

    protected get(path: string) {
        return this.httpClient.get(`${environment.apiServicesBaseUrl}/${path}`, {
            headers: {
                "Authentication": this.authService.token
            }
        }).toPromise();
    }
}