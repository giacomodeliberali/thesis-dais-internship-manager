import { ActivatedRouteSnapshot } from "@angular/router";

export function getFullPath(route: ActivatedRouteSnapshot) {
    const path = [];
    let current = route;
    while (current) {
        path.push(current.url);
        current = current.parent;
    }
    return path.reverse().join('/');
};