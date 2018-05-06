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

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(InternshipsRoutes),
        FormsModule,
        CKEditorModule
    ],
    declarations: [
        InternshipsViewComponent,
        InternshipAddComponent,
        InternshipEditComponent,
        InternshipsOwnCompanyComponent,
        InternshipDetailsComponent
    ]
})
export class InternshipsModule { }
