/**
 * The default values for the server
 */
export class ServerDefaults {
    /** The JWT header token name */
    public static jwtTokenHeaderName: string = "token";

    /** The request.body.popertyName used to populate the decoded JWT token in baseController.useAuth() */
    public static authUserBodyPropertyName: string = "__user";

    /** The api base url */
    public static apiBaseUrl: string = "/api";
}