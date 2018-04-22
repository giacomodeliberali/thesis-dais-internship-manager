
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { RoleType } from 'gdl-thesis-core/dist';
import { canExec } from '../helpers/can-exec.helper';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  public static getFullPath(route: ActivatedRouteSnapshot) {
    let path = [];
    let current = route;
    while (current) {
      path.push(current.url);
      current = current.parent;
    }
    return path.reverse().join('/');
  };

  constructor(
    public auth: AuthService,
    public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.currentUser) {
      console.log("User is not authenticated, redirect to '/'");
      this.router.navigate(['/']);
      return false;
    }


    const requiredRoles: Array<RoleType> = route.data && route.data.requiredRoles ? route.data.requiredRoles : [];
    const canActivate = canExec(this.auth.currentUser.role.type, requiredRoles);


    if (canActivate) {
      console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' can activate route '${AuthGuardService.getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);
    } else {
      console.log(`User '${this.auth.currentUser.email}' with role '${this.auth.currentUser.role.name} - ${this.auth.currentUser.role.type}' cannot activate route '${AuthGuardService.getFullPath(route)}' which require roles [${requiredRoles.join(',')}]`);
    }

    return canActivate;
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.canActivate(route);
  }
}