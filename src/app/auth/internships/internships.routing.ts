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
import { InternshipsStudentsListComponent } from './students-list/internships-students-list.component';
import { InternshipCandidateComponent } from './candidate/internship-candidate.component';

export const InternshipsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'offers'
    },
    {
        path: '',
        children: [
            generateAuthRoute('offers', InternshipsViewComponent, [], 'Pages.InternshipOffers.Title'),
            generateAuthRoute('offers/:id/candidate', InternshipCandidateComponent, [RoleType.Student], 'Pages.InternshipCandidate.Title'),
            generateAuthRoute('add', InternshipAddComponent, [RoleType.Company], 'Pages.InternshipAdd.Title'),
            generateAuthRoute('edit/:id', InternshipEditComponent, [RoleType.Company], 'Pages.InternshipEdit.Title'),
            generateAuthRoute('details/:id', InternshipDetailsComponent, [], 'Pages.InternshipDetails.Title'),
            generateAuthRoute('company', InternshipsOwnCompanyComponent, [RoleType.Company], 'Pages.InternshipOwnCompany.Title'),
            generateAuthRoute('approve-list', InternshipsApproveListComponent, [RoleType.Professor], 'Pages.InternshipApproveList.Title'),
            generateAuthRoute('approve/:id', InternshipApproveComponent, [RoleType.Professor], 'Pages.InternshipApprove.Title'),
            generateAuthRoute('students-list', InternshipsStudentsListComponent, [RoleType.Professor], 'Pages.InternshipProposalList.Title')
        ]
    }
];
