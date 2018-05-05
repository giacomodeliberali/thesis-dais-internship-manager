import { Routes } from '@angular/router';

import { generateAuthRoute } from '../../helpers/generate.auth-route.helper';
import { InternshipsViewComponent } from './view/internships-view.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { RoleType } from 'gdl-thesis-core/dist';
import { InternshipAddComponent } from './add/internship-add.component';
import { InternshipEditComponent } from './edit/internship-edit.component';
import { InternshipsOwnCompanyComponent } from './own-company/internships-own-company.component';

export const InternshipsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: '',
        children: [
            generateAuthRoute('list', InternshipsViewComponent),
            generateAuthRoute('add', InternshipAddComponent, [RoleType.Company]),
            generateAuthRoute('edit/:id', InternshipEditComponent, [RoleType.Company]),
            generateAuthRoute('company', InternshipsOwnCompanyComponent, [RoleType.Company])
        ]
    }
];
