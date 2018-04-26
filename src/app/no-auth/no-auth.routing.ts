import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { CompanyLoginComponent } from './company-login/company-login.component';

/**
 * The routes that a not authenticated user can reach
 */
export const NoAuthRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'login',
                children: [
                    {
                        path: 'company',
                        component: CompanyLoginComponent
                    }
                ]
            },
            {
                path: 'lock',
                component: LockComponent
            },
            {
                path: 'register',
                component: RegisterComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'company'
                    },
                    {
                        path: 'company',
                        component: RegisterComponent
                    }
                ]
            }
        ]
    }
];
