import { Routes } from '@angular/router';

import { generateAuthRoute } from '../../helpers/generate.auth-route.helper';
import { InternshipProposalsListComponent } from './proposals-list/internship-proposals-list.component';
import { InternshipOwnProposalsListComponent } from './own-proposals-list/internship-own-proposals-list.component';
import { RoleType, Role } from 'thesis-dais-internship-manager-core';
import { InternshipProposalDetailsComponent } from './details/internship-proposal-details.component';
import { InternshipProposalEditComponent } from './edit/internship-proposal-edit.component';
import { InternshipProposalApproveComponent } from './approve/internship-proposal-approve.component';
import { CompanyInternshipProposalsListComponent } from './company-internship-proposals-list/company-internship-proposals-list.component';
import { InternshipProposalTrackComponent } from './track/internship-proposal-track.component';

export const ProposalsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'student'
    },
    {
        path: '',
        children: [
            generateAuthRoute('professor', InternshipProposalsListComponent, [RoleType.Professor], 'Pages.InternshipProposalList.Title'),
            generateAuthRoute('student', InternshipOwnProposalsListComponent, [RoleType.Student], 'Pages.InternshipOwnProposalList.Title'),
            generateAuthRoute('details/:id', InternshipProposalDetailsComponent, [], 'Pages.InternshipProposalDetails.Title'),
            generateAuthRoute('track/:id', InternshipProposalTrackComponent, [], 'Pages.InternshipProposalTrack.Title'),
            generateAuthRoute('edit/:id', InternshipProposalEditComponent, [RoleType.Student], 'Pages.InternshipProposalDetails.Title'),
            generateAuthRoute('approve/:id', InternshipProposalApproveComponent, [RoleType.Professor, RoleType.Company], 'Pages.InternshipProposalApprove.Title'),
            generateAuthRoute('company', CompanyInternshipProposalsListComponent, [RoleType.Company], 'Pages.CompanyInternshipProposals.Title'),
        ]
    }
];
