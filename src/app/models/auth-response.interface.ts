import { User } from "gdl-thesis-core/dist";

/** 
 * The authentication response
 */
export interface AuthResponse {
    /** The [[User]] */
    user: User,
    /** The user token */
    token: string;
}