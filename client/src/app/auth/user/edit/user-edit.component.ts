import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from 'thesis-dais-internship-manager-core';
import { UsersService } from '../../../services/user.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { LoadingService } from '../../../helpers/loading.helper';


@Component({
	moduleId: module.id,
	selector: 'user-edit-cmp',
	templateUrl: 'user-edit.component.html'
})
export class UserEditComponent {

	/** A copy of the user current in edit */
	public user: User;

	/** An array of phones to overcome => https://github.com/angular/angular.js/issues/13327  */
	public phones: Array<any> = [];

	/**
	 * Inject deps
	 */
	constructor(
		public authService: AuthService,
		private userService: UsersService,
		private router: Router,
		private loadingService: LoadingService) {

		this.user = this.authService.currentUser.clone();

		this.phones = this.user.phone.map(p => { return { value: p } });
		if (this.phones.length == 0)
			this.addPhone();
	}

	/**
	 * Add a new phone at the end
	 */
	addPhone() {
		this.phones.push({ value: '' });
	}

	/**
	 * Save the user and redirect back
	 */
	save() {
		this.loadingService.isLoading = true;

		this.user.phone = this.phones.map(p => p.value).filter(p => !!p);

		this.userService.updateOwn(this.user).then(r => {
			NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
			if (r && r.isOk && r.data.token) {
				this.authService.token = r.data.token;
			}
			this.router.navigate(['/auth/user']);
		}).catch(ex => {
			NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
			console.error(ex);
		}).then(() => {
			this.loadingService.isLoading = false;
		});
	}

}
