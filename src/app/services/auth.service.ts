import { environment } from "environments/environment";
import { Injectable } from "@angular/core";
import { User, ApiResponseDto, AuthResponse } from 'gdl-thesis-core/dist';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";

/** The Google API Javascript SDK */
declare var gapi: any;

/**
 * The authentication service
 */
@Injectable()
export class AuthService {

    /** The current logged in [[User]] */
    public get currentUser(): User {
        try {
            const user = localStorage.getItem("currentUser");

            if (!user)
                return null;

            return new User(JSON.parse(user));
        } catch (ex) {
            console.error("Error getting currentUser", ex);
            return null;
        }
    };

    /** Set the current logged in [[User]] */
    public set currentUser(user: User) {
        try {
            if (user)
                localStorage.setItem("currentUser", JSON.stringify(user));
            else
                localStorage.removeItem("currentUser");
        } catch (ex) {
            console.error("Error setting currentUser", ex);
        }
    };

    /** The current logged in user token */
    public get token(): string {
        return localStorage.getItem("token");
    }

    /** Set the current logged in user token */
    public set token(value: string) {
        if (value)
            localStorage.setItem("token", value);
        else
            localStorage.removeItem("token");
    }

    /** The Google API configuration */
    private oauth2: any;


    /**
     * Inject deps and retrive last saved token and [[User]]
     * @param httpClient The fetch client
     */
    constructor(private httpClient: HttpClient) {
    }

    /**
     * Validate server side the current token
     */
    public async validateToken(): Promise<User> {
        try {
            const result: ApiResponseDto<User> = await this.post('auth/token/validate', {
                token: this.token
            });
            if (result && result.isOk && result.data)
                return result.data;
            return null;
        } catch (ex) {
            return Promise.resolve(null);
        }
    }

    protected post(path: string, body: any) {
        return this.httpClient.post(`${environment.servicesBaseUrl}/${path}`, body).toPromise() as Promise<any>;
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

                if (apiResponse.isOk) {
                    this.token = apiResponse.data.token;
                    this.currentUser = apiResponse.data.user;
                }

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
     * Log out the current user
     */
    async logout() {
        try {
            const googleAuth = await this.initialize();
            const googleUser = await googleAuth.signOut();
            this.token = null;
            this.currentUser = null;
        } catch (ex) {
            console.log("Cannot logout from google", ex);
        }
    }
    /**
     * Log the user in
     *
     * @param {string} email The user email
     * @param {string} password The user password
     */
    public async login(email: string, password: string): Promise<ApiResponseDto<AuthResponse>> {
        const apiResponse = await this.post('auth/login', {
            email: email,
            password: password
        });

        if (apiResponse.isOk) {
            this.token = apiResponse.data.token;
            this.currentUser = apiResponse.data.user
        }

        return apiResponse;
    }
    /**
     * Register a new user
     *
     * @param {User} user The new user
     */
    public async register(user: User) {

        const apiResponse = await this.post('auth/register', user.clone()) as ApiResponseDto<AuthResponse>;

        if (apiResponse.isOk) {
            this.token = apiResponse.data.token;
            this.currentUser = apiResponse.data.user;
        }

        return apiResponse;
    }

}