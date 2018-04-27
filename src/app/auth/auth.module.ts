import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutes } from './auth.routing';

/**
 * The module loaded when the user is authenticated
 */
@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(AuthRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [

    ]
})
export class AuthModule { }
