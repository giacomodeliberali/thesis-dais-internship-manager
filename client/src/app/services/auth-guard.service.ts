
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { RoleType } from 'thesis-dais-internship-manager-core';
import { canExec } from '../helpers/can-exec.helper';
import { getFullPath } from '../helpers/get-full-path.helper';
import { NotificationHelper } from '../helpers/notification.helper';

/**
 * The Auth guard service. Used to determine if the user can access the desierd routes.
 */
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  /**
   * Creates an instance of AuthGuardService.
   * @param {AuthService} auth The authService
   * @param {Router} router The router
   */
  constructor(
    public auth: AuthService,
    public router: Router) {
  }

  /**
   * Return true if the current user can navigate the given route, false otherwise
   *
   * @param {ActivatedRouteSnapshot} route The route the user is navigating to
   */
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    if (!this.auth.currentUser || !this.auth.currentUser.role || !this.auth.token) {
      this.auth.token = null;
      this.auth.currentUser = null;
      console.log("User is not authenticated, redirect to '/'");
      this.router.navigate(['/']);
      return false;
    }

    // Pick route required roles from it data property
    const requiredRoles: Array<RoleType> = route.data && route.data.requiredRoles ? route.data.requiredRoles : [];

    let canActivate = false;

    // Check roles
    canActivate = canExec(this.auth.currentUser.role.type, requiredRoles);

    // Log
    if (canActivate) {
      // Check session
      this.auth.currentUser = await this.auth.validateToken();
    }

    if (!this.auth.currentUser) {
      console.log("Session expired or invalid token");
      NotificationHelper.showNotification("Alerts.SessionExpired.Message", "ti-lock", "warning");
      this.auth.token = null;
      this.auth.currentUser = null;
    }


    if (canActivate)
      // tslint:disable-next-line:max-line-length
      console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' can activate route '${getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);
    else
      // tslint:disable-next-line:max-line-length
      console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' cannot activate route '${getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);



    if (!canActivate || !this.auth.currentUser) {
      console.log("Redirect to '/not-found'");
      this.router.navigate(['/not-found']);
      return false;
    }

    return canActivate;
  }

  /**
   * Return true if the current user can navigate the children of the route, false otherwise
   *
   * @param {ActivatedRouteSnapshot} route The route the user is navigating to
   */
  canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.canActivate(route);
  }
}
