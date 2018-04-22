"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The default values for the server
 */
class ServerDefaults {
}
/** The JWT header token name */
ServerDefaults.jwtTokenHeaderName = "token";
/** The request.body.popertyName used to populate the decoded JWT token in baseController.useAuth() */
ServerDefaults.authUserBodyPropertyName = "__user";
/** The api base url */
ServerDefaults.apiBaseUrl = "/api";
exports.ServerDefaults = ServerDefaults;
