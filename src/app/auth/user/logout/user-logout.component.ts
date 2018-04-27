import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
	moduleId: module.id,
	selector: 'user-logout-cmp',
	templateUrl: 'user-logout.component.html'
})
export class UserLogoutComponent {
	constructor(
		private authService: AuthService,
		private router: Router) {

		this.authService.googleLogout();
		this.router.navigate(['/']);
	}

	
}
