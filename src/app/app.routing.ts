import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { NoAuthLayoutComponent } from './layouts/no-auth/no-auth-layout.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoleType } from 'gdl-thesis-core/dist';
import { generateAuthRoute } from './helpers/generate.auth-route.helper';

/**
 * The application routes
 */
export const AppRoutes: Routes = [
    {
        path: '',
        component: NoAuthLayoutComponent,
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
