import { Routes } from '@angular/router';

import { generateAuthRoute } from '../../helpers/generate.auth-route.helper';
import { InternshipsViewComponent } from './view/internships-view.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { RoleType } from 'gdl-thesis-core/dist';
import { InternshipAddComponent } from './add/internship-add.component';
import { InternshipEditComponent } from './edit/internship-edit.component';
import { InternshipsOwnCompanyComponent } from './own-company/internships-own-company.component';
import { InternshipDetailsComponent } from './details/internship-details.component';
import { InternshipsApproveListComponent } from './approve-list/internships-approve-list.component';
import { InternshipApproveComponent } from './approve/internship-approve.component';

export const InternshipsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'offers'
    },
    {
        path: '',
        children: [
            generateAuthRoute('offers', InternshipsViewComponent),
            generateAuthRoute('add', InternshipAddComponent, [RoleType.Company]),
            generateAuthRoute('edit/:id', InternshipEditComponent, [RoleType.Company]),
            generateAuthRoute('details/:id', InternshipDetailsComponent),
            generateAuthRoute('company', InternshipsOwnCompanyComponent, [RoleType.Company]),
            generateAuthRoute('approve-list', InternshipsApproveListComponent, [RoleType.Professor]),
            generateAuthRoute('approve/:id', InternshipApproveComponent, [RoleType.Professor])
        ]
    }
];
