
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { RoleType } from 'gdl-thesis-core/dist';
import { canExec } from '../helpers/can-exec.helper';

/**
 * The Auth guard service. Used to determine if the user can access the desierd routes.
 */
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  /**
   * Given a route, return it path from the top level parent (eg. auth/dashboard/stats)
   * @param route The route
   */
  public static getFullPath(route: ActivatedRouteSnapshot) {
    let path = [];
    let current = route;
    while (current) {
      path.push(current.url);
      current = current.parent;
    }
    return path.reverse().join('/');
  };

  /**
   * Inject deps
   * @param auth The [[AuthService]]
   * @param router The Router
   */
  constructor(
    public auth: AuthService,
    public router: Router) {
  }

  /**
   * Return true if the current user can navigate the given route, false otherwise.
   * @param route The route the user is navigating to
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.currentUser) {
      console.log("User is not authenticated, redirect to '/'");
      this.router.navigate(['/']);
      return false;
    }

    // Pick route required roles from it data property
    const requiredRoles: Array<RoleType> = route.data && route.data.requiredRoles ? route.data.requiredRoles : [];

    // Check roles
    const canActivate = canExec(this.auth.currentUser.role.type, requiredRoles);

    // Log
    if (canActivate)
      console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' can activate route '${AuthGuardService.getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);
    else
      console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' cannot activate route '${AuthGuardService.getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);

    return canActivate;
  }

  /**
   * Return true if the current user can navigate the children of the route, false otherwise.
   * @param route The route the user is navigating to
   */
  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.canActivate(route);
  }
}