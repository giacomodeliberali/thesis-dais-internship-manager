import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address, InternshipStatusType, RoleType } from 'gdl-thesis-core/dist';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { InternshipsService } from '../../../services/internships.service';
/* import * as moment from 'moment';
import 'moment/locale/it'; */
import { AuthService } from '../../../services/auth.service';
import { CompaniesService } from '../../../services/companies.service';
import { LoadingHelper } from '../../../helpers/loading.helper';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { canExec } from '../../../helpers/can-exec.helper';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-details-cmp',
	templateUrl: 'internship-details.component.html'
})
export class InternshipDetailsComponent {

	/** The internships current in edit */
	public internship: Internship;

	/** The enum exported to the template */
	public InternshipStatusType = InternshipStatusType;

	/** The enum exported to the template */
	public RoleType = RoleType;

	/** The can exec exported to the template */
	public canExec = canExec;

	/**
	 * Inject deps
	 */
	constructor(
		public internshipsService: InternshipsService,
		public authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private location: Location,
		public domSanitizer: DomSanitizer) {

		LoadingHelper.isLoading = true;

		const internshipId = this.activatedRoute.snapshot.params['id'];

		this.internshipsService.getById(internshipId)
			.then(response => {
				this.internship = new Internship(response.data);
			})
			.catch(ex => {
				console.error(ex);
			})
			.then(() => {
				LoadingHelper.isLoading = false;
			});
	}


}
