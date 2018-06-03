import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { InternshipStatusType, Internship } from 'gdl-thesis-core/dist';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GridComponent, Column } from '../../../components/grid/grid.component';

declare var $;

@Component({
    selector: 'internships-own-company-cmp',
    templateUrl: './internships-own-company.component.html'
})
export class InternshipsOwnCompanyComponent implements OnInit {

    public InternshipStatusType = InternshipStatusType;

    @ViewChild(GridComponent) table: GridComponent<Internship>;
    @ViewChild('statusTemplate') statusTemplate: TemplateRef<Internship>;
    rows: Array<Internship> = null;
    columns: Array<Column<Internship>> = null;

    constructor(
        private internshipsService: InternshipsService,
        private authService: AuthService,
        private router: Router,
        private datePipe: DatePipe) {

        this.internshipsService.getByCompanyOwnerId(this.authService.currentUser.id).then(internsips => {
            if (internsips.isOk)
                this.rows = internsips.data;
        }).catch(ex => {
            NotificationHelper.showNotification('Alerts.GetAllInternships.Error.Title', 'ti-warn', 'info');
        });
    }

    ngOnInit() {
        const sub: Subscription = this.table.onRowSelection.subscribe(((internship: Internship) => {
            this.router.navigate(['/auth/internships/details/', internship.id]);
            sub.unsubscribe();
        }));

        this.columns = [
            { name: 'Dictionary.Company', prop: 'company.name' },
            { name: 'Dictionary.StartDate', prop: 'startDate', cellClass: 'text-center', pipe: this.datePipe },
            { name: 'Dictionary.EndDate', prop: 'endDate', cellClass: 'text-center', pipe: this.datePipe },
            { name: 'Dictionary.Title', prop: 'title' },
            { name: 'Dictionary.TotalHours', prop: 'totalHours' },
            {
                name: 'Dictionary.Status',
                prop: 'status',
                cellTemplate: this.statusTemplate
            }
        ];
    }



}
