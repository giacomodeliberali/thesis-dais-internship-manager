import { Routes } from '@angular/router';
import { UserLogoutComponent } from './logout/user-logout.component';
import { UserViewComponent } from './view/user-view.component';
import { generateAuthRoute } from '../../helpers/generate.auth-route.helper';
import { UserEditComponent } from './edit/user-edit.component';
import { RoleType } from 'gdl-thesis-core/dist';
import { AuthGuardService } from '../../services/auth-guard.service';
import { CompanyEditComponent } from './company-edit/company-edit.component';


export const UserRoutes: Routes = [
    {
        path: '',
        children: [
            generateAuthRoute('', UserViewComponent, [], 'Pages.User.Title'),
            generateAuthRoute('edit', UserEditComponent, [], 'Pages.UserEdit.Title'),
            generateAuthRoute('logout', UserLogoutComponent),
            generateAuthRoute('edit/company/:id', CompanyEditComponent, [RoleType.Company], 'Pages.EditCompany.Title')
        ]
    }
];
