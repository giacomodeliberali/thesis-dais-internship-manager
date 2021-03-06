import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address, InternshipStatusType } from 'thesis-dais-internship-manager-core';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { InternshipsService } from '../../../services/internships.service';
/* import * as moment from 'moment';
import 'moment/locale/it'; */
import { AuthService } from '../../../services/auth.service';
import { CompaniesService } from '../../../services/companies.service';
import { LoadingService } from '../../../helpers/loading.helper';
import { Location } from '@angular/common';
import { ClientDefaults } from '../../../models/client-defaults.model';
import { TranslateService } from '@ngx-translate/core';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-add-cmp',
	templateUrl: 'internship-add.component.html'
})
export class InternshipAddComponent {

	/** The internships current in edit */
	public internship: Internship;

	/** The current user company */
	public companies: Array<Company> = [];

	public selectedCompanyId: string;

	public config: any;

	/**
	 * Inject deps
	 */
	constructor(
		public internshipsService: InternshipsService,
		public authService: AuthService,
		private companiesService: CompaniesService,
		private router: Router,
		private location: Location,
		private translateService: TranslateService,
		private loadingService: LoadingService) {

		this.config = Object.assign({}, ClientDefaults.ckEditorConfig, { language: translateService.currentLang });

		this.loadingService.isLoading = true;

		this.internship = new Internship({
			address: new Address(),
			status: InternshipStatusType.NotApproved,
			studentsNumber: 1,
			endDate: null,
			startDate: null
		});

		this.companiesService.getByOwnerId(this.authService.currentUser.id).then(response => {
			this.selectedCompanyId = response.data[0].id;
			this.companies.push(...response.data);
			this.updateAddress();
			setTimeout(() => {
				$(".selectpicker").selectpicker('refresh');
			});
		}).then(() => {
			this.loadingService.isLoading = false;
		});
	}

	updateAddress() {
		this.internship.address = new Address(this.companies.find(c => c.id === this.selectedCompanyId).address).clone();
	}

	/**
	 * Save the user and redirect back
	 */
	save() {
		this.loadingService.isLoading = true;
		this.internship.company = this.selectedCompanyId as any;
		if (this.internship.startDate)
			this.internship.startDate = new Date(this.internship.startDate);
		if (this.internship.endDate)
			this.internship.endDate = new Date(this.internship.endDate);
		this.internshipsService.create(this.internship).then(r => {
			NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
			this.router.navigate(['/auth/internships/company']);
		}).catch(ex => {
			NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
			console.error(ex);
		}).then(() => {
			this.loadingService.isLoading = false;
		});
	}

}
