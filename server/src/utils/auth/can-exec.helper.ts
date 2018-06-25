import { RoleType } from "thesis-dais-internship-manager-core";

/**
 * Return true if the given role number has at least one requiredRoles or is an admin
 * @param role The current logged in user role
 * @param requiredRoles The required roles for the operation
 */
export function canExec(role: number | RoleType, requiredRoles: Array<RoleType>) {

    // If the user is an admin, return always true
    if ((role & RoleType.Admin) === RoleType.Admin)
        return true;

    // Otherwise check roles
    let canExecV = false;

    if (requiredRoles && requiredRoles.length > 0) {
        let i = 0;
        while (i < requiredRoles.length && !canExecV) {
            if ((role & requiredRoles[i]) === requiredRoles[i])
                canExecV = true;
            i++;
        }
    } else {
        canExecV = true;
    }

    return canExecV;
}