import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../helpers/loading.helper';


@Component({
	moduleId: module.id,
	selector: 'user-logout-cmp',
	templateUrl: 'user-logout.component.html'
})
export class UserLogoutComponent implements OnInit {
	constructor(
		private authService: AuthService,
		private router: Router,
		private loadingService: LoadingService) {

		this.loadingService.isLoading = true;
	}

	async ngOnInit() {
		await this.authService.logout();
		await this.router.navigate(['/']);
		this.loadingService.isLoading = false;
	}


}
