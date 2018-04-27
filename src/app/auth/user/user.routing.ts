import { Routes } from '@angular/router';
import { UserLogoutComponent } from './logout/user-logout.component';
import { UserViewComponent } from './view/user-view.component';
import { generateAuthRoute } from '../../helpers/generate.auth-route.helper';
import { UserEditComponent } from './edit/user-edit.component';
import { RoleType } from 'gdl-thesis-core/dist';


export const UserRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            redirectTo: 'view'
        },
        generateAuthRoute('view', UserViewComponent),
        generateAuthRoute('edit', UserEditComponent),
        generateAuthRoute('logout', UserLogoutComponent)
    ]
}];
