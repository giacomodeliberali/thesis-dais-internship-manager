import { RoleType } from "thesis-dais-internship-manager-core";
import { AuthGuardService } from "../services/auth-guard.service";
import { Route } from "@angular/router";


export function generateAuthRouteModule(path: string, loadChildren: string, roles: Array<RoleType> = []): Route {
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

export function generateAuthRoute(path: string, component: any, roles: Array<RoleType> = [], title?: string): Route {
    return {
        path: path,
        canActivate: [
            AuthGuardService
        ],
        data: {
            requiredRoles: roles,
            title: title
        },
        component: component
    };
}