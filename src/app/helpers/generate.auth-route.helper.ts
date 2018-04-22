import { RoleType } from "gdl-thesis-core/dist";
import { AuthGuardService } from "../services/auth-guard.service";
import { Route } from "@angular/router";


export function generateAuthRoute(path: string, loadChildren: string, roles: Array<RoleType> = []): Route {
    return {
        path: path,
        canActivate: [
            AuthGuardService
        ],
        data: {
            requiredRoles: roles
        },
        loadChildren: loadChildren,
        children: null
    };
}