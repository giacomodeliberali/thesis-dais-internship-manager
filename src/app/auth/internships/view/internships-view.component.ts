import { Component } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
declare var $;
@Component({
    selector: 'internships-view-cmp',
    templateUrl: './internships-view.component.html'
})
export class InternshipsViewComponent {

    tableData1 = {
        headerRow: [
            'Dictionary.Company',
            { value: 'Dictionary.StartDate', class: 'text-center' },
            'Dictionary.EndDate',
            'Dictionary.TotalHours',
            'Dictionary.Title'
        ] as Array<any>,
        dataRows: []
    };

    public isLoading = true;

    constructor(private internshipsService: InternshipsService) {
        this.internshipsService.getAll().then(internsips => {
            if (internsips.isOk)
                this.tableData1.dataRows = internsips.data;

            this.isLoading = false;
        }).catch(ex => {
            NotificationHelper.showNotification('Alerts.GetAllInternships.Error.Title', 'ti-warn', 'info');
            this.isLoading = false;
        });
    }


    ngAfterViewInit() {
        // Init Tooltips
        $('[rel="tooltip"]').tooltip();
    }

}
