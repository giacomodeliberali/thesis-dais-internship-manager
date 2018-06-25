import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User, Company, Address } from 'thesis-dais-internship-manager-core';
import { UsersService } from '../../../services/user.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { CompaniesService } from '../../../services/companies.service';
import { LoadingService } from '../../../helpers/loading.helper';


@Component({
	moduleId: module.id,
	selector: 'company-edit-cmp',
	templateUrl: 'company-edit.component.html'
})
export class CompanyEditComponent {

	/** A copy of the company current in edit */
	public company: Company;

	/**
	 * Inject deps
	 */
	constructor(
		public authService: AuthService,
		private companiesService: CompaniesService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private loadingService: LoadingService) {

		this.loadingService.isLoading = true;
		const companyId = this.activatedRoute.snapshot.params.id;
		this.companiesService.getById(companyId)
			.then(response => {
				const company = new Company(response.data);
				if (!company.address)
					company.address = new Address();

				this.company = company;
			})
			.then(() => {
				this.loadingService.isLoading = false;
			});
	}


	/**
	 * Save the user and redirect back
	 */
	save() {
		this.loadingService.isLoading = true;
		this.company.owners = this.company.owners.map(u => u.id) as any;
		this.companiesService.update(this.company).then(r => {
			NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
			this.router.navigate(['/auth/user']);
		}).catch(ex => {
			NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
			console.error(ex);
		}).then(() => {
			this.loadingService.isLoading = false;
		});
	}

}
