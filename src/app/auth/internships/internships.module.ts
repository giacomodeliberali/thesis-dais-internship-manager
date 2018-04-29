import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InternshipsRoutes } from './internships.routing';
import { SharedModule } from '../../shared/shared.module';
import { InternshipsViewComponent } from './view/internships-view.component';
import { InternshipAddComponent } from './add/internship-add.component';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(InternshipsRoutes),
        FormsModule
    ],
    declarations: [
        InternshipsViewComponent,
        InternshipAddComponent
    ]
})
export class InternshipsModule { }
