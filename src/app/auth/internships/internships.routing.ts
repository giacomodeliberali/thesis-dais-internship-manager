import { Routes } from '@angular/router';

import { generateAuthRoute } from '../../helpers/generate.auth-route.helper';
import { InternshipsViewComponent } from './view/internships-view.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { RoleType } from 'gdl-thesis-core/dist';

export const InternshipsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: '',
        children: [
            generateAuthRoute('list', InternshipsViewComponent),
            generateAuthRoute('add', InternshipsViewComponent, [RoleType.Company]),
            generateAuthRoute('edit', InternshipsViewComponent, [RoleType.Company])
        ]
    }
];
