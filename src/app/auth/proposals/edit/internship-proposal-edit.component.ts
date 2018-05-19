import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address, InternshipStatusType, RoleType, InternshipProposal, InternshipProposalStatusType } from 'gdl-thesis-core/dist';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { InternshipsService } from '../../../services/internships.service';
/* import * as moment from 'moment';
import 'moment/locale/it'; */
import { AuthService } from '../../../services/auth.service';
import { CompaniesService } from '../../../services/companies.service';
import { LoadingService } from '../../../helpers/loading.helper';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { canExec } from '../../../helpers/can-exec.helper';
import { InternshipProposalService } from '../../../services/internships-proposal.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-proposal-edit-cmp',
	templateUrl: 'internship-proposal-edit.component.html'
})
export class InternshipProposalEditComponent implements OnInit {

	/** The internships current in edit */
	public internshipProposal: InternshipProposal;

	/** The enum exported to the template */
	public InternshipProposalStatusType = InternshipProposalStatusType;

	/** The enum exported to the template */
	public RoleType = RoleType;

	/** The can exec exported to the template */
	public canExec = canExec;

	/**
	 * Inject deps
	 */
	constructor(
		private internshipProposalService: InternshipProposalService,
		public authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private location: Location,
		public domSanitizer: DomSanitizer,
		private loadingService: LoadingService,
		private translateService: TranslateService) {

	}

	async ngOnInit() {
		try {
			this.loadingService.isLoading = true;

			const internshipProposalId = this.activatedRoute.snapshot.params['id'];
			const internshipProposalResponse = await this.internshipProposalService.getById(internshipProposalId);

			this.internshipProposal = new InternshipProposal(internshipProposalResponse.data);
		} catch (ex) {
			console.error(ex);
		} finally {
			this.loadingService.isLoading = false;
		}
	}

	public async cancel() {
		const response = await swal({
			type: 'question',
			text: await this.translateService.get("Alerts.ConfirmCancelInternshipProposal.Title").toPromise(),
			showCancelButton: true,
			cancelButtonText: await this.translateService.get("Dictionary.Cancel").toPromise(),
			confirmButtonText: await this.translateService.get("Dictionary.Confirm").toPromise()
		});

		if (response.value) {
			try {
				const apiResponse = await this.internshipProposalService.updateStatus(this.internshipProposal.id, InternshipProposalStatusType.Canceled);
				this.internshipProposal = new InternshipProposal(apiResponse.data);
				NotificationHelper.showNotification("Alerts.ConfirmCancelInternshipProposal.Success.Message", "ti-save", 'success');
			} catch (ex) {
				console.error(ex);
				NotificationHelper.showNotification("Alerts.ConfirmCancelInternshipProposal.Error.Message", "ti-save", 'warning');
			}
		}
	}
}
