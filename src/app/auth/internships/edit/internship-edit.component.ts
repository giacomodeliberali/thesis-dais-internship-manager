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
import swal from 'sweetalert2';

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
		private translateService: TranslateService) {

		this.config = Object.assign({}, ClientDefaults.ckEditorConfig, { language: translateService.currentLang });

		LoadingHelper.isLoading = true;

		const internshipId = this.activatedRoute.snapshot.params['id'];

		Promise.all([
			this.internshipsService.getById(internshipId)
				.then(response => {
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
			})
		]).then(async () => {
			const states = await this.internshipsService.getAvailableStates(this.internship.status);

			this.states = states.filter(s => {
				return s.value !== InternshipStatusType.Approved && s.value !== InternshipStatusType.Rejected;
			});

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
			LoadingHelper.isLoading = true;
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
				LoadingHelper.isLoading = false;
			}
		}
	}

}
