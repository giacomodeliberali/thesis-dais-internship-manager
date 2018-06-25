import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { DatePipe } from '@angular/common';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { InternshipStatusType, Internship } from 'thesis-dais-internship-manager-core';
import { GridComponent, Column } from '../../../components/grid/grid.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../helpers/loading.helper';
declare var $;
@Component({
    selector: 'internships-view-cmp',
    templateUrl: './internships-view.component.html'
})
export class InternshipsViewComponent implements OnInit {

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


        this.internshipsService.getApproved()
            .then(internships => {
                if (internships.isOk) {
                    this.rows = internships.data;
                }
            }).catch(ex => {
                NotificationHelper.showNotification('Alerts.GetAllInternships.Error.Title', 'ti-warn', 'info');
            });
    }

    ngOnInit() {
        const sub: Subscription = this.table.onRowSelection.subscribe(((internship: Internship) => {
            this.router.navigate(['/auth/internships/details/', internship.id]);
            sub.unsubscribe();
        }));
    }

}
