import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoAuthRoutes } from './no-auth.routing';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CompanyLoginComponent } from './company-login/company-login.component';
import { AuthService } from '../services/auth.service';
import { SharedModule } from '../shared/shared.module';
import { IndexComponent } from './index/index.component';

/**
 * The module loaded when the user is not authenticated
 */
@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(NoAuthRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        LoginComponent,
        CompanyLoginComponent,
        RegisterComponent,
        LockComponent,
        IndexComponent
    ]
})

export class NoAuthModule { }
