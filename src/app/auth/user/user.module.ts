import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SharedModule } from '../../shared/shared.module';
import { UserRoutes } from './user.routing';
import { UserLogoutComponent } from './logout/user-logout.component';
import { UserViewComponent } from './view/user-view.component';
import { UserEditComponent } from './edit/user-edit.component';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(UserRoutes),
        FormsModule
    ],
    declarations: [
        UserEditComponent,
        UserLogoutComponent,
        UserViewComponent
    ]
})

export class UserModule { }
