
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { RoleType } from 'gdl-thesis-core/dist';
import { canExec } from '../helpers/can-exec.helper';
import { getFullPath } from '../helpers/get-full-path.helper';

/**
 * The Auth guard service. Used to determine if the user can access the desierd routes.
 */
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

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

    let canActivate: boolean = false;
    try {
      // Check roles
      canActivate = canExec(this.auth.currentUser.role.type, requiredRoles);

      // Log
      if (canActivate)
        console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' can activate route '${getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);
      else
        console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' cannot activate route '${getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);
    } catch (ex) {
      console.log(`Exception executing 'canActivate' on route ${getFullPath(route)}`, ex);
    }

    if (!canActivate) {
      console.log("Redirect to '/not-found'");
      this.router.navigate(['/not-found']);
      return false;
    }

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