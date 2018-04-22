import { environment } from "environments/environment";
import { Injectable } from "@angular/core";
import { User, ApiResponse } from 'gdl-thesis-core/dist';
import { HttpClient } from "@angular/common/http";
declare var gapi: any;

@Injectable()
export class AuthService {

    public currentUser: User;
    public token: string;

    private oauth2: any;


    constructor(private httpClient: HttpClient) {
        const cachedResponse = this.getAuthResponse();
        this.token = cachedResponse.token;
        this.currentUser = cachedResponse.user;
    }

    private initialize() {
        if (this.oauth2)
            return Promise.resolve(this.oauth2);

        return new Promise((resolve, reject) => {
            try {
                gapi.load('auth2', () => {
                    gapi.auth2.init({
                        client_id: environment.google.clientId,
                        scope: 'profile email'
                    }).then(async (googleAuth) => {
                        this.oauth2 = googleAuth;
                        resolve(this.oauth2);
                    });
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public googleLogin(): Promise<AuthResponse> {
        return this.initialize().then(async googleAuth => {
            // res => https://developers.google.com/identity/sign-in/web/reference#googleauthissignedinget            

            // Ready
            try {

                const isSignedIn = googleAuth.isSignedIn.get();

                let googleUser: any = null;
                if (isSignedIn) {
                    googleUser = googleAuth.currentUser.get();
                } else {
                    googleUser = await googleAuth.signIn();
                }

                const accessToken = googleUser.getAuthResponse().access_token;


                const apiResponse: ApiResponse<AuthResponse> = await this.httpClient.post(`${environment.servicesBaseUrl}/auth/google`, {
                    access_token: accessToken
                }).toPromise() as any;


                this.currentUser = apiResponse.data.user;
                localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
                localStorage.setItem("token", apiResponse.data.token);


                return apiResponse.data;
            } catch (ex) {
                if (googleAuth.isSignedIn.get()) {
                    await googleAuth.signOut();
                }
                throw ex;
            }
        }) as Promise<AuthResponse>;
    }

    async googleLogout() {
        try {
            const googleAuth = await this.initialize();
            const googleUser = await googleAuth.signOut();
            this.clearAuthResponse();
            this.currentUser = null;
            this.token = null;
        } catch (ex) {
            console.log("Cannot logout from google", ex);
        }
    }

    private setAuthResponse(res: AuthResponse) {
        localStorage.setItem("currentUser", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
    }

    private getAuthResponse(): AuthResponse {
        const strinfigiedUser = localStorage.getItem("currentUser");
        return {
            user: strinfigiedUser ? JSON.parse(strinfigiedUser) : null,
            token: localStorage.getItem("token")
        };
    }

    private clearAuthResponse() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
    }
}

interface AuthResponse {
    user: User,
    token: string;
}