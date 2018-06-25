import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address, Defaults, InternshipStatusType, RoleType, ApiResponseDto } from 'thesis-dais-internship-manager-core';
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
import { canExec } from '../../../helpers/can-exec.helper';
import swal from 'sweetalert2';
import { throws } from 'assert';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-edit-cmp',
	templateUrl: 'internship-edit.component.html'
})
export class InternshipEditComponent {

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
		private loadingService: LoadingService) {

		this.config = Object.assign({}, ClientDefaults.ckEditorConfig, { language: translateService.currentLang });

		this.init();
	}

	async init() {
		const internshipId = this.activatedRoute.snapshot.params['id'];
		try {
			this.loadingService.isLoading = true;

			let response: ApiResponseDto<any> = await this.internshipsService.getById(internshipId);

			let internship: Internship = null;
			if (response.isOk) {
				internship = new Internship(response.data);
			}

			if (!internship.company.owners.find(o => o.id === this.authService.currentUser.id)) {
				throw new Error("auth/user-unauthorized");
			}

			if (internship.status !== InternshipStatusType.NotApproved) {
				throw new Error("edit/cannot-edit-bad-status");
			}

			this.internship = new Internship(internship);

			response = await this.companiesService.getByOwnerId(this.authService.currentUser.id);
			this.selectedCompanyId = response.data[0].id;
			this.companies.push(...response.data);

			this.updateAddress();

			this.states = await this.internshipsService.getAvailableStates(this.internship.status);

		} catch (ex) {
			if (ex && (ex.message === 'auth/user-unauthorized' || ex.message === 'edit/cannot-edit-bad-status')) {
				NotificationHelper.showNotification("Alerts.GenericError.NotAuthorized.SubTitle", "ti-save", "danger");
				await this.router.navigate(['/auth/internships/details', internshipId]);
			}
		} finally {
			setTimeout(() => $(".selectpicker").selectpicker('refresh'));
			this.loadingService.isLoading = false;
		}
	}

	updateAddress() {
		if (this.internship && !this.internship.address)
			this.internship.address = new Address(this.companies.find(c => c.id === this.selectedCompanyId).address).clone();
	}

	/**
	 * Save the user and redirect back
	 */
	save() {
		// TODO: add server middleware to prevent a company to approve its own internship
		this.loadingService.isLoading = true;
		this.internship.company = this.selectedCompanyId as any;
		if (this.internship.startDate)
			this.internship.startDate = new Date(this.internship.startDate);
		if (this.internship.endDate)
			this.internship.endDate = new Date(this.internship.endDate);
		this.internshipsService.update(this.internship).then(r => {
			NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
			this.location.back();
			this.loadingService.isLoading = false;
		}).catch(ex => {
			NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
			console.error(ex);
			this.loadingService.isLoading = false;
		});
	}

	async delete() {
		const result = await swal({
			title: await this.translateService.get('Alerts.ConfirmDelete.Title').toPromise(),
			text: await this.translateService.get("Alerts.ConfirmDelete.SubTitle").toPromise(),
			type: "question",
			showCancelButton: true,
			cancelButtonText: await this.translateService.get('Dictionary.Cancel').toPromise(),
			confirmButtonText: await this.translateService.get('Dictionary.Delete').toPromise()
		});

		if (result.value) {
			this.loadingService.isLoading = true;
			try {
				const response = await this.internshipsService.delete(this.internship.id);
				if (response && response.data) {
					NotificationHelper.showNotification("Alerts.Delete.Success.Message", "ti-save", "success");
					this.location.back();
				} else {
					NotificationHelper.showNotification("Alerts.Delete.Error.Message", "ti-save", "danger");
				}
			} catch (ex) {
				NotificationHelper.showNotification("Alerts.Delete.Error.Message", "ti-save", "danger");
				console.error(ex);
			} finally {
				this.loadingService.isLoading = false;
			}
		}
	}

}
