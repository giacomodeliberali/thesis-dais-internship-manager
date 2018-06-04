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
	selector: 'internship-proposal-details-cmp',
	templateUrl: 'internship-proposal-details.component.html'
})
export class InternshipProposalDetailsComponent implements OnInit {

	/** The internships current in edit */
	public internshipProposal: InternshipProposal;

	/** The enum exported to the template */
	public InternshipProposalStatusType = InternshipProposalStatusType;

	/** The enum exported to the template */
	public RoleType = RoleType;

	/** The can exec exported to the template */
	public canExec = canExec;

	public canStartInternship = false;

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

			// The user is the student
			if (this.internshipProposal.student.id === this.authService.currentUser.id ||
				// or the professor
				this.internshipProposal.professor.id === this.authService.currentUser.id ||
				// or the company owner
				!!this.internshipProposal.internship.company.owners.find(o => o.id === this.authService.currentUser.id)) {
				this.canStartInternship = true;
			}


		} catch (ex) {
			console.error(ex);
		} finally {
			this.loadingService.isLoading = false;
		}
	}

	async startInternship() {

		const response = await swal({
			type: 'question',
			text: await this.translateService.get(`Alerts.ConfirmStartInternshipProposal.Title`).toPromise(),
			showCancelButton: true,
			cancelButtonText: await this.translateService.get("Dictionary.Cancel").toPromise(),
			confirmButtonText: await this.translateService.get("Dictionary.Confirm").toPromise()
		});

		if (response.value) {
			try {
				const apiResponse = await this.internshipProposalService.updateStatus(this.internshipProposal.id, InternshipProposalStatusType.Started);
				if (apiResponse && apiResponse.isOk) {
					this.internshipProposal = new InternshipProposal(apiResponse.data);
					NotificationHelper.showNotification(`Alerts.ConfirmStartInternshipProposal.Success.Message`, "ti-save", 'success');
					this.router.navigate(['/auth/proposals/track/' + this.internshipProposal.id]);
				}
			} catch (ex) {
				console.error(ex);
				NotificationHelper.showNotification(`Alerts.ConfirmStartInternshipProposal.Error.Message`, "ti-save", 'warning');
			}
		}
	}

	async generateDocs() {
		try {

			this.loadingService.isLoading = true;

			const result = await this.internshipProposalService.generateDocs(this.internshipProposal.id);
			const fileUrl = URL.createObjectURL(result);
			// window.open(fileUrl);


			var a = document.createElement("a");
			document.body.appendChild(a);

			a.href = fileUrl;
			a.download = `${new Date().getTime()}-${this.internshipProposal.student.name.toLowerCase().split(' ').join('-')}.pdf`;
			a.click();
			window.URL.revokeObjectURL(fileUrl);


		} catch (ex) {
			NotificationHelper.showNotification("Alerts.GenericError.SubTitle", "ti-close", "warning");
			console.error("GenerateDocs", ex);
		}
		finally {
			this.loadingService.isLoading = false;
		}
	}


}
