
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { RoleType } from 'gdl-thesis-core/dist';
import { canExec } from '../helpers/can-exec.helper';

/**
 * The NoAuth guard service. Used to determine if the user can access the desierd routes.
 */
@Injectable()
export class NoAuthGuardService implements CanActivate, CanActivateChild {

  /**
   * Creates an instance of NoAuthGuardService.
   * @param {AuthService} auth The authService
   * @param {Router} router The router
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
    if (this.auth.currentUser && this.auth.currentUser.role && this.auth.token) {
      console.log("User is authenticated, redirect to '/auth'");
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }

  /**
   * Return true if the current user can navigate the children of the route, false otherwise.
   * @param route The route the user is navigating to
   */
  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.canActivate(route);
  }
}