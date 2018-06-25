import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { DatePipe } from '@angular/common';
import { InternshipProposalService } from '../../../services/internships-proposal.service';
import { AuthService } from '../../../services/auth.service';
import { InternshipProposalStatusType, InternshipProposal } from 'thesis-dais-internship-manager-core';
import { TranslatePipe } from '@ngx-translate/core';
import { GridComponent, Column } from '../../../components/grid/grid.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

declare var $;

@Component({
    selector: 'internship-own-proposals-list-cmp',
    templateUrl: './internship-own-proposals-list.component.html'
})
export class InternshipOwnProposalsListComponent implements OnInit {


    @ViewChild(GridComponent) table: GridComponent<InternshipProposal>;
    @ViewChild('statusTemplate') statusTemplate: TemplateRef<InternshipProposal>;
    rows: Array<InternshipProposal> = null;
    columns: Array<Column<InternshipProposal>> = null;

    public InternshipProposalStatusType = InternshipProposalStatusType;

    constructor(
        private authService: AuthService,
        private internshipProposalService: InternshipProposalService,
        private datePipe: DatePipe,
        private router: Router) {

        this.internshipProposalService.getByStudentId(this.authService.currentUser.id).then(response => {
            if (response.isOk)
                this.rows = response.data;
        }).catch(ex => {
            NotificationHelper.showNotification('Alerts.GetAllInternships.Error.Title', 'ti-warn', 'info');
        });
    }

    ngOnInit() {
        this.columns = [
            { name: 'Dictionary.Company', prop: 'internship.company.name' },
            { name: 'Dictionary.StartDate', prop: 'internship.startDate', cellClass: 'text-center', pipe: this.datePipe },
            { name: 'Dictionary.EndDate', prop: 'internship.endDate', cellClass: 'text-center', pipe: this.datePipe },
            {
                name: 'Dictionary.Status',
                prop: 'status',
                cellTemplate: this.statusTemplate
            },
        ];

        const sub: Subscription = this.table.onRowSelection.subscribe(((internshipProposal: InternshipProposal) => {
            if (internshipProposal.status === InternshipProposalStatusType.Started)
                this.router.navigate(['/auth/proposals/track/', internshipProposal.id]);
            else
                this.router.navigate(['/auth/proposals/details/', internshipProposal.id]);
            sub.unsubscribe();
        }));
    }

}
