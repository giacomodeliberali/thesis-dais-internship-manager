import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address, Defaults, InternshipStatusType, RoleType } from 'gdl-thesis-core/dist';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { InternshipsService } from '../../../services/internships.service';
/* import * as moment from 'moment';
import 'moment/locale/it'; */
import { AuthService } from '../../../services/auth.service';
import { CompaniesService } from '../../../services/companies.service';
import { LoadingHelper } from '../../../helpers/loading.helper';
import { Location } from '@angular/common';
import { ClientDefaults } from '../../../models/client-defaults.model';
import { TranslateService } from '@ngx-translate/core';
import { canExec } from '../../../helpers/can-exec.helper';
import { DomSanitizer } from '@angular/platform-browser';
import { MailOptions, EmailsService } from '../../../services/emails.service';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-approve-cmp',
	templateUrl: 'internship-approve.component.html'
})
export class InternshipApproveComponent {

	/** The internships current in edit */
	public internship: Internship;

	/** The current user company */
	public companies: Array<Company> = [];

	public selectedCompanyId: string;

	public startDate = new Date();

	public config = null;

	public states = null;

	public InternshipStatusType = InternshipStatusType;

	/**
	 * Inject deps
	 */
	constructor(
		public internshipsService: InternshipsService,
		public authService: AuthService,
		private companiesService: CompaniesService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private location: Location,
		private translateService: TranslateService,
		public domSanitizer: DomSanitizer,
		private emailsService: EmailsService) {

		this.config = Object.assign({}, ClientDefaults.ckEditorConfig, { language: translateService.currentLang });

		LoadingHelper.isLoading = true;

		const internshipId = this.activatedRoute.snapshot.params['id'];

		this.internshipsService.getById(internshipId)
			.then(async response => {
				this.internship = new Internship(response.data);

				if (this.internship.status !== InternshipStatusType.NotApproved) {
					NotificationHelper.showNotification("Alerts.ApproveWrongInternshipStatus.Title", "ti-alert", "danger");
					this.location.back();
				} else {
					this.states = [
						{
							text: InternshipStatusType[InternshipStatusType.NotApproved],
							value: InternshipStatusType.NotApproved
						},
						{
							text: InternshipStatusType[InternshipStatusType.Approved],
							value: InternshipStatusType.Approved
						},
						{
							text: InternshipStatusType[InternshipStatusType.Rejected],
							value: InternshipStatusType.Rejected
						}
					];
				}
			})
			.catch(ex => {
				console.error(ex);
			}).then(() => {

				setTimeout(() => {
					$(".selectpicker").selectpicker('refresh');
				});
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


		if (this.internship.status !== InternshipStatusType.Rejected)
			this.internship.rejectReason = null;

		this.internshipsService.updateStatus(this.internship.id, this.internship.status, this.internship.rejectReason)
			.then(async r => {

				if (r && r.isOk && r.data.status == InternshipStatusType.Approved) {
					const options: MailOptions = {
						html: `La tua offerta di stage ${r.data.id} è stato approvata`,
						subject: 'Stage approvato',
						to: r.data.company.owners.map(o => o.email)
					};
					try {
						await this.emailsService.send(options);
					} catch (ex) {
						console.error(ex);
					}
					NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
					this.location.back();
				}
				LoadingHelper.isLoading = false;
			}).catch(ex => {
				NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
				console.error(ex);
				LoadingHelper.isLoading = false;
			});
	}

}
