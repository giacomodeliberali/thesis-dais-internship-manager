import { Routes } from '@angular/router';

import { generateAuthRouteModule } from '../helpers/generate.auth-route.helper';
import { AuthGuardService } from '../services/auth-guard.service';

/**
 * The routes that an authenticated user can reach
 */
export const AuthRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'internships'
    },
    {
        path: '',
        children: [
            generateAuthRouteModule('internships', './internships/internships.module#InternshipsModule', []),
            generateAuthRouteModule('user', './user/user.module#UserModule', []),
            generateAuthRouteModule('proposals', './proposals/proposals.module#ProposalsModule', []),
        ]
    }
];