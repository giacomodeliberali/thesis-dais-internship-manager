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
            { name: 'Dictionary.Company', value: 'company.name' },
            { name: 'Dictionary.StartDate', value: 'startDate', class: 'text-center' },
            { name: 'Dictionary.EndDate', value: 'endDate', class: 'text-center' },
            { name: 'Dictionary.TotalHours', value: 'totalHours' },
            { name: 'Dictionary.Title', value: 'title' }
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

    /**
     * Access the object by path. eg val(obj,'uno.due.tre') return obj.uno.due.tre
     * @param obj The object
     * @param path The path
     */
    public val(obj: any, path: string) {

        const paths = path.split('.');
        let current = obj;

        for (let i = 0; i < paths.length; ++i) {
            if (current[paths[i]] === undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    };

}
