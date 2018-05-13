import { Component } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { InternshipStatusType, Internship } from 'gdl-thesis-core/dist';
import { TranslatePipe } from '@ngx-translate/core';

declare var $;

@Component({
    selector: 'internships-own-company-cmp',
    templateUrl: './internships-own-company.component.html'
})
export class InternshipsOwnCompanyComponent {

    internshipTable = {
        headerRow: [
            { name: 'Dictionary.Company', value: 'company.name' },
            { name: 'Dictionary.StartDate', value: 'startDate', class: 'text-center', pipe: DatePipe },
            { name: 'Dictionary.EndDate', value: 'endDate', class: 'text-center', pipe: DatePipe },
            { name: 'Dictionary.Title', value: 'title' },
            { name: 'Dictionary.TotalHours', value: 'totalHours' },
            {
                name: 'Dictionary.Status',
                value: 'status',
                formatter: (data: any, col?: any, row?: Internship) => 'Enums.InternshipStatusType.' + InternshipStatusType[data],
                translate: true
            }
        ] as Array<any>,
        dataRows: []
    };

    public isLoading = true;

    public InternshipStatusType = InternshipStatusType;

    constructor(
        private internshipsService: InternshipsService,
        private authService: AuthService) {

        this.internshipsService.getByCompanyOwnerId(this.authService.currentUser.id).then(internsips => {
            if (internsips.isOk)
                this.internshipTable.dataRows = internsips.data;
        }).catch(ex => {
            NotificationHelper.showNotification('Alerts.GetAllInternships.Error.Title', 'ti-warn', 'info');
        }).then(() => {
            this.isLoading = false;

            setTimeout(() => {
                // Init Tooltips
                $('[rel="tooltip"]').tooltip();
            });
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
