import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Internship, CompanyStatusType, Company, Address, InternshipStatusType, InternshipProposal, InternshipProposalStatusType } from 'gdl-thesis-core/dist';
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
import { Observable } from 'rxjs/Observable';
import 'rxjs/operators';
import { UsersService } from '../../../services/user.service';
import { InternshipProposalService } from '../../../services/internships-proposal.service';
declare var $;

@Component({
	moduleId: module.id,
	selector: 'internship-candidate-cmp',
	templateUrl: 'internship-candidate.component.html'
})
export class InternshipCandidateComponent {

	/** The internships current in edit */
	public internshipsProposal: InternshipProposal;

	public professor: User;

	/**
	 * Inject deps
	 */
	constructor(
		public internshipProposalsService: InternshipProposalService,
		public authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private location: Location,
		private usersService: UsersService,
		private translateService: TranslateService) {

		this.internshipsProposal = new InternshipProposal({
			creationDate: new Date(),
			internship: this.activatedRoute.snapshot.params.id,
			student: this.authService.currentUser.id as any,
			status: InternshipProposalStatusType.WaitingForProfessor
		});

	}

	public getProfessors(search: string): Observable<Array<User>> {
		return this.usersService.lookupProfessors(search).map(v => {
			if (v.data) {
				return v.data.map(p => {
					p.name = p.name.toUpperCase();
					return p;
				});
			}
			return [];
		});
	}

	/**
	 * Save the user and redirect back
	 */
	save() {
		LoadingHelper.isLoading = true;
		this.internshipsProposal.professor = this.professor.id as any;
		this.internshipProposalsService.create(this.internshipsProposal).then(r => {
			NotificationHelper.showNotification("Alerts.Save.Success.Message", "ti-save", "success");
			this.location.back();
		}).catch(ex => {
			NotificationHelper.showNotification("Alerts.Save.Error.Message", "ti-save", "danger");
			console.error(ex);
		}).then(() => {
			LoadingHelper.isLoading = false;
		});
	}

}
