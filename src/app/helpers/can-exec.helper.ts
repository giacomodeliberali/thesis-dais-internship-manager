import { RoleType } from "gdl-thesis-core/dist";

export function canExec(role: number | RoleType, requiredRoles: Array<RoleType>) {
    let canExec = false;

    if (requiredRoles && requiredRoles.length > 0) {
        let i = 0;
        while (i < requiredRoles.length && !canExec) {
            if ((role & requiredRoles[i]) === requiredRoles[i])
                canExec = true;
            i++;
        }
    } else {
        canExec = true;
    }

    return canExec;
}