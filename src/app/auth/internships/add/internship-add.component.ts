import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address } from 'gdl-thesis-core/dist';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { InternshipsService } from '../../../services/internships.service';
/* import * as moment from 'moment';
import 'moment/locale/it'; */
import { AuthService } from '../../../services/auth.service';
import { CompaniesService } from '../../../services/companies.service';

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

	/**
	 * Inject deps
	 */
	constructor(
		public internshipsService: InternshipsService,
		public authService: AuthService,
		private companiesService: CompaniesService,
		private router: Router) {

		this.internship = new Internship({
			address: new Address()
		});

		this.companiesService.getByOwnerId(this.authService.currentUser.id).then(response => {
			this.selectedCompanyId = response.data[0].id;
			this.companies.push(...response.data);
			this.updateAddress();
			setTimeout(() => {
				$(".selectpicker").selectpicker('refresh');
			});
		});
	}

	updateAddress() {
		this.internship.address = new Address(this.companies.find(c => c.id === this.selectedCompanyId).address).clone();
	}

	/**
	 * Save the user and redirect back
	 */
	save() {
		this.internship.company = this.selectedCompanyId as any;
		this.internship.startDate = new Date(this.internship.startDate);
		this.internship.endDate = new Date(this.internship.endDate);
		this.internshipsService.create(this.internship).then(r => {
			NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
			this.router.navigate(['/auth/internships']);
		}).catch(ex => {
			NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
			console.error(ex);
		});
	}

	/* 	ngOnInit() {
			$('.datepicker').datetimepicker({
				format: 'MM/DD/YYYY',    //use this format if you want the 12hours timpiecker with AM/PM toggle,
				locale: 'it',
				icons: {
					time: "fa fa-clock-o",
					date: "fa fa-calendar",
					up: "fa fa-chevron-up",
					down: "fa fa-chevron-down",
					previous: 'fa fa-chevron-left',
					next: 'fa fa-chevron-right',
					today: 'fa fa-screenshot',
					clear: 'fa fa-trash',
					close: 'fa fa-remove'
				}
			});
		} */

}
