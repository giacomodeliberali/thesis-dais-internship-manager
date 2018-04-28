import { environment } from "environments/environment";
import { Injectable } from "@angular/core";
import { User, ApiResponseDto, AuthResponse } from 'gdl-thesis-core/dist';
import { HttpClient } from "@angular/common/http";

/** The Google API Javascript SDK */
declare var gapi: any;

/**
 * The authentication service
 */
@Injectable()
export class AuthService {

    /** The current logged in [[User]] */
    public currentUser: User;

    /** The current logged in user token */
    public token: string;

    /** The Google API configuration */
    private oauth2: any;


    /**
     * Inject deps and retrive last saved token and [[User]]
     * @param httpClient The fetch client
     */
    constructor(private httpClient: HttpClient) {
        const cachedResponse = this.getAuthResponse();
        this.token = cachedResponse.token;
        this.currentUser = cachedResponse.user ? new User(cachedResponse.user) : null;
    }

    public updateUser(user: User) {
        if (this.currentUser && this.token) {
            this.currentUser = new User(user);
            this.setAuthResponse({
                token: this.token,
                user: this.currentUser,
                isNew: false
            });
        }
    }

    /**
     * Initialize the Google API SKD
     */
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
                    }).catch(ex => {
                        reject(ex);
                    });
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    /**
     * Login in the user with Google popup
     */
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


                const apiResponse: ApiResponseDto<AuthResponse> = await this.httpClient.post(`${environment.servicesBaseUrl}/auth/google`, {
                    access_token: accessToken
                }).toPromise() as any;


                this.currentUser = new User(apiResponse.data.user);
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

    /**
     * Log out the current user from Google
     */
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

    /**
     * Cache an [[AuthResponse]] in the local storage
     * @param res The auth response
     */
    private setAuthResponse(res: AuthResponse) {
        localStorage.setItem("currentUser", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
    }

    /**
     * Retrive the [[AuthResponse]] from the local storage
     */
    private getAuthResponse(): AuthResponse {
        const strinfigiedUser = localStorage.getItem("currentUser");
        return {
            user: strinfigiedUser ? JSON.parse(strinfigiedUser) : null,
            token: localStorage.getItem("token"),
            isNew: false
        };
    }

    /**
     * Clear the local storage auth response
     */
    private clearAuthResponse() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
    }
}