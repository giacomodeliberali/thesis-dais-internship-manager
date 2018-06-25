import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { NoAuthLayoutComponent } from './layouts/no-auth/no-auth-layout.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoleType } from 'thesis-dais-internship-manager-core';
import { generateAuthRouteModule } from './helpers/generate.auth-route.helper';
import { NoAuthGuardService } from './services/no-auth-guard.service';

/**
 * The application routes
 */
export const AppRoutes: Routes = [
    {
        path: '',
        component: NoAuthLayoutComponent,
        canActivate: [
            NoAuthGuardService
        ],
        canActivateChild: [
            NoAuthGuardService
        ],
        children: [
            {
                path: '',
                loadChildren: './no-auth/no-auth.module#NoAuthModule'
            }
        ]
    },
    {
        path: 'auth',
        canActivate: [
            AuthGuardService
        ],
        canLoad: [
            AuthGuardService
        ],
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './auth/auth.module#AuthModule'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/not-found'
    }
];
