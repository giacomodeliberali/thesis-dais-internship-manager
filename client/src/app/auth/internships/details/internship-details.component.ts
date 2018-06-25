import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address, InternshipStatusType, RoleType, InternshipProposalStatusType } from 'thesis-dais-internship-manager-core';
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

declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-details-cmp',
	templateUrl: 'internship-details.component.html'
})
export class InternshipDetailsComponent implements OnInit {

	/** The internships current in edit */
	public internship: Internship;

	/** The enum exported to the template */
	public InternshipStatusType = InternshipStatusType;

	/** The enum exported to the template */
	public RoleType = RoleType;

	/** The can exec exported to the template */
	public canExec = canExec;

	public availablePlace = 0;

	public alreadyCandidate = false;

	/**
	 * Inject deps
	 */
	constructor(
		public internshipsService: InternshipsService,
		private internshipProposalService: InternshipProposalService,
		public authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private location: Location,
		public domSanitizer: DomSanitizer,
		private loadingService: LoadingService) {

	}

	async ngOnInit() {
		try {
			this.loadingService.isLoading = true;

			const internshipId = this.activatedRoute.snapshot.params['id'];
			const internshipResponse = await this.internshipsService.getById(internshipId);
			this.internship = new Internship(internshipResponse.data);

			const placesResponse = await this.internshipProposalService.getAvailablePlace(internshipId);
			this.availablePlace = placesResponse.data;

			if (canExec(this.authService.currentUser.role.type, [RoleType.Student])) {
				const alreadyCandidateResponse = await this.internshipProposalService.getByStudentId(this.authService.currentUser.id);
				this.alreadyCandidate = !!alreadyCandidateResponse.data.find(p => p.internship.id == this.internship.id && p.status < InternshipProposalStatusType.Ended);
			}
		} catch (ex) {
			console.error(ex);
		} finally {
			this.loadingService.isLoading = false;
		}
	}


}
