import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address } from 'gdl-thesis-core/dist';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { InternshipsService } from '../../../services/internships.service';
/* import * as moment from 'moment';
import 'moment/locale/it'; */
import { AuthService } from '../../../services/auth.service';
import { CompaniesService } from '../../../services/companies.service';
import { LoadingHelper } from '../../../helpers/loading.helper';
import { Location } from '@angular/common';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-details-cmp',
	templateUrl: 'internship-details.component.html'
})
export class InternshipDetailsComponent {

	/** The internships current in edit */
	public internship: Internship;

	/** The current user company */
	public companies: Array<Company> = [];

	public selectedCompanyId: string;

	public startDate = new Date();

	/**
	 * Inject deps
	 */
	constructor(
		public internshipsService: InternshipsService,
		public authService: AuthService,
		private companiesService: CompaniesService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private location: Location) {


		LoadingHelper.isLoading = true;

		const internshipId = this.activatedRoute.snapshot.params['id'];

		Promise.all([
			this.internshipsService.getById(internshipId)
				.then(response => {
					if (response)
						this.internship = new Internship(response.data);
				})
				.catch(ex => {
					console.error(ex);
				})
			,
			this.companiesService.getByOwnerId(this.authService.currentUser.id).then(response => {
				this.selectedCompanyId = response.data[0].id;
				this.companies.push(...response.data);
				this.updateAddress();
				setTimeout(() => {
					$(".selectpicker").selectpicker('refresh');
				});
			})
		]).then(() => {
			LoadingHelper.isLoading = false;
		});
	}

	updateAddress() {
		if (this.internship)
			this.internship.address = new Address(this.companies.find(c => c.id === this.selectedCompanyId).address).clone();
	}

	/**
	 * Save the user and redirect back
	 */
	save() {
		LoadingHelper.isLoading = true;
		this.internship.company = this.selectedCompanyId as any;
		this.internship.startDate = new Date(this.internship.startDate);
		this.internship.endDate = new Date(this.internship.endDate);
		this.internshipsService.update(this.internship).then(r => {
			NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
			this.location.back();
			LoadingHelper.isLoading = false;
		}).catch(ex => {
			NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
			console.error(ex);
			LoadingHelper.isLoading = false;
		});
	}

}
