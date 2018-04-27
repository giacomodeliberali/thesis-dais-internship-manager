import { Routes } from '@angular/router';

import { generateAuthRoute } from '../helpers/generate.auth-route.helper';

/**
 * The routes that an authenticated user can reach
 */
export const AuthRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: '',
        children: [
            generateAuthRoute('dashboard', './auth/dashboard/dashboard.module#DashboardModule', []),
        ]
    }
];
