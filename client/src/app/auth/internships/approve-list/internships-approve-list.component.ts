import { Component, ViewChild, OnInit } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { DatePipe } from '@angular/common';
import { GridComponent, Column } from '../../../components/grid/grid.component';
import { Internship } from 'thesis-dais-internship-manager-core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

declare var $;

@Component({
    selector: 'internships-approve-list-cmp',
    templateUrl: './internships-approve-list.component.html'
})
export class InternshipsApproveListComponent implements OnInit {


    @ViewChild(GridComponent) table: GridComponent<Internship>;
    rows: Array<Internship> = null;
    columns: Array<Column<Internship>> = [
        { name: 'Dictionary.Company', prop: 'company.name' },
        { name: 'Dictionary.StartDate', prop: 'startDate', cellClass: 'text-center', pipe: this.datePipe },
        { name: 'Dictionary.EndDate', prop: 'endDate', cellClass: 'text-center', pipe: this.datePipe },
        { name: 'Dictionary.Title', prop: 'title' },
        { name: 'Dictionary.TotalHours', prop: 'totalHours' }
    ];

    constructor(
        private internshipsService: InternshipsService,
        private datePipe: DatePipe,
        private router: Router) {

        this.internshipsService.getNotApproved().then(response => {
            if (response.isOk)
                this.rows = response.data;
        }).catch(ex => {
            NotificationHelper.showNotification('Alerts.GetAllInternships.Error.Title', 'ti-warn', 'info');
        });
    }

    ngOnInit() {
        const sub: Subscription = this.table.onRowSelection.subscribe(((internship: Internship) => {
            this.router.navigate(['/auth/internships/approve/', internship.id]);
            sub.unsubscribe();
        }));
    }

}
