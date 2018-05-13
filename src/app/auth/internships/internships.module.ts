import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InternshipsRoutes } from './internships.routing';
import { SharedModule } from '../../shared/shared.module';
import { InternshipsViewComponent } from './view/internships-view.component';
import { InternshipAddComponent } from './add/internship-add.component';
import { InternshipEditComponent } from './edit/internship-edit.component';
import { InternshipsOwnCompanyComponent } from './own-company/internships-own-company.component';
import { InternshipDetailsComponent } from './details/internship-details.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { InternshipsApproveListComponent } from './approve-list/internships-approve-list.component';
import { InternshipApproveComponent } from './approve/internship-approve.component';
import { InternshipsStudentsListComponent } from './students-list/internships-students-list.component';
import { InternshipCandidateComponent } from './candidate/internship-candidate.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(InternshipsRoutes),
        FormsModule,
        CKEditorModule,
        NguiAutoCompleteModule
    ],
    declarations: [
        InternshipsViewComponent,
        InternshipAddComponent,
        InternshipEditComponent,
        InternshipsOwnCompanyComponent,
        InternshipDetailsComponent,
        InternshipsApproveListComponent,
        InternshipApproveComponent,
        InternshipsStudentsListComponent,
        InternshipCandidateComponent
    ]
})
export class InternshipsModule { }
