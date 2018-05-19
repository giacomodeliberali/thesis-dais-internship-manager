import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProposalsRoutes } from './proposals.routing';
import { InternshipProposalsListComponent } from './proposals-list/internship-proposals-list.component';
import { InternshipOwnProposalsListComponent } from './own-proposals-list/internship-own-proposals-list.component';
import { InternshipProposalDetailsComponent } from './details/internship-proposal-details.component';
import { InternshipProposalEditComponent } from './edit/internship-proposal-edit.component';
import { InternshipProposalApproveComponent } from './approve/internship-proposal-approve.component';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(ProposalsRoutes),
        FormsModule
    ],
    declarations: [
        InternshipProposalsListComponent,
        InternshipOwnProposalsListComponent,
        InternshipProposalDetailsComponent,
        InternshipProposalEditComponent,
        InternshipProposalApproveComponent
    ]
})
export class ProposalsModule { }
