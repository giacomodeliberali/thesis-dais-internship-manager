import { OnInit, Component, Input } from "@angular/core";
import { InternshipProposal, InternshipProposalStatusType } from "gdl-thesis-core/dist";
import { TranslateService } from "@ngx-translate/core";
import swal from "sweetalert2";
import { NotificationHelper } from "../../helpers/notification.helper";
import { InternshipProposalService } from "../../services/internships-proposal.service";

declare var $: any;

@Component({
	moduleId: module.id,
	selector: 'attendances-cmp',
	templateUrl: './attendances.component.html'
})
export class AttendancesComponent {

	/** The internships current in edit */
	@Input()
	internshipProposal: InternshipProposal;

	/** The enum exported to the template */
	public InternshipProposalStatusType = InternshipProposalStatusType;

	/** The total hours minus attendances sum */
	public get totalHours() {
		let sum = 0;
		if (this.internshipProposal && this.internshipProposal.attendances)
			this.internshipProposal.attendances.forEach(a => sum += a.hours);
		return sum;
	}

	/**
	 *Creates an instance of AttendancesComponent.
	 * @param {TranslateService} translateService
	 * @param {InternshipProposalService} internshipProposalService
	 */
	constructor(
		private translateService: TranslateService,
		private internshipProposalService: InternshipProposalService) {
	}
	/**
	 * Add a new attendance to the current internship
	 */
	async addAttendance() {
		(swal as any).mixin({
			input: 'text',
			confirmButtonText: await this.translateService.get('Dictionary.Forward').toPromise() + ' &rarr;',
			showCancelButton: true,
			cancelButtonText: await this.translateService.get('Dictionary.Cancel').toPromise(),
			progressSteps: ['1', '2']
		}).queue([
			{
				title: await this.translateService.get('Alerts.AddAttendance.Date.Title').toPromise(),
				text: await this.translateService.get('Alerts.AddAttendance.Date.SubTitle').toPromise()
			},
			{
				title: await this.translateService.get('Alerts.AddAttendance.Duration.Title').toPromise(),
				text: await this.translateService.get('Alerts.AddAttendance.Duration.SubTitle').toPromise()
			}
		]).then(async result => {
			if (result.value) {

				if (!result.value[0] || !result.value[1])
					return;

				if (new Date(result.value[0]) > new Date()) {
					NotificationHelper.showNotification("Alerts.GenericError.Title", "ti-close", "warning");
					return;
				}

				try {
					const response = await this.internshipProposalService.addAttendances(this.internshipProposal.id, [
						{
							date: new Date(result.value[0]),
							hours: Number(result.value[1])
						}
					]);
					if (response.data) {
						const temp = new InternshipProposal(response.data);
						temp.attendances = temp.attendances || [];
						temp.attendances.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
						this.internshipProposal = temp;
					}

					NotificationHelper.showNotification("Alerts.AddAttendance.Success.Title", "ti-check", "success");
				} catch (ex) {
					console.error(ex);
					NotificationHelper.showNotification("Alerts.GenericError.Title", "ti-close", "warning");
				}
			}
		})
		setTimeout(() => {
			// TODO: Prepopulate with today date and with custom datepicker
			$(".swal2-input").attr("type", "date");
		});
	}
}
