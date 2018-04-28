import { User } from "../entities";
/**
 * The authentication response
 */
export interface AuthResponse {
    /** The [[User]] */
    user: User;
    /** The user token */
    token: string;
    /** True if the user is new */
    isNew: boolean;
}
