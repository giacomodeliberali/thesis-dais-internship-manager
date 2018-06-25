"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** The [[User]] auth type */
var AuthType;
(function (AuthType) {
    /** The [[User]] is registred with email and password */
    AuthType[AuthType["Local"] = 1] = "Local";
    /** The [[User]] is registred with Google */
    AuthType[AuthType["Google"] = 2] = "Google";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
