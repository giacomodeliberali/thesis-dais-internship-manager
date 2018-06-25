import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { RoleType, Company } from 'thesis-dais-internship-manager-core';
import { canExec } from '../../../helpers/can-exec.helper';
import { CompaniesService } from '../../../services/companies.service';
import { LoadingService } from '../../../helpers/loading.helper';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'user-view-cmp',
	templateUrl: 'user-view.component.html'
})
export class UserViewComponent {

	public currentLanguage: string;

	public RoleType = RoleType;
	public canExec = canExec;

	public ownComapnies: Array<Company>;

	constructor(
		public authService: AuthService,
		private translateService: TranslateService,
		private companiesService: CompaniesService,
		private loadingService: LoadingService) {


		this.currentLanguage = this.translateService.currentLang;

		if (canExec(this.authService.currentUser.role.type, [RoleType.Company])) {
			this.loadingService.isLoading = true;
			this.companiesService.getByOwnerId(this.authService.currentUser.id).then(response => {
				if (response.isOk)
					this.ownComapnies = response.data;
			}).catch(ex => {
				console.error(ex);
			}).then(() => {
				this.loadingService.isLoading = false;
			});
		}
	}

	onChangeLanguage() {
		this.loadingService.isLoading = true;
		console.log("Use " + this.currentLanguage);
		localStorage.setItem('default:culture', this.currentLanguage);
		window.location.reload();
	}

	ngOnInit() {
		setTimeout(() => {
			$(".selectpicker").selectpicker();
		}, 200);

	}
}
