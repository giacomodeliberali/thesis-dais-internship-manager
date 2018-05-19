import { Component } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { DatePipe } from '@angular/common';
import { InternshipProposalService } from '../../../services/internships-proposal.service';
import { AuthService } from '../../../services/auth.service';
import { InternshipProposalStatusType } from 'gdl-thesis-core/dist';
import { TranslatePipe } from '@ngx-translate/core';

declare var $;

@Component({
    selector: 'internship-own-proposals-list-cmp',
    templateUrl: './internship-own-proposals-list.component.html'
})
export class InternshipOwnProposalsListComponent {

    internshipTable = {
        headerRow: [
            { name: 'Dictionary.Company', value: 'internship.company.name' },
            { name: 'Dictionary.StartDate', value: 'internship.startDate', class: 'text-center', pipe: DatePipe },
            { name: 'Dictionary.EndDate', value: 'internship.endDate', class: 'text-center', pipe: DatePipe },
            {
                name: 'Dictionary.Status',
                value: 'status',
                class: 'text-center',
                formatter: (value) => 'Enums.InternshipProposalStatusType.' + InternshipProposalStatusType[value],
                translate: true
            },
        ] as Array<any>,
        dataRows: []
    };

    public isLoading = true;

    constructor(
        private authService: AuthService,
        private internshipProposalService: InternshipProposalService) {

        this.internshipProposalService.getByStudentId(this.authService.currentUser.id).then(response => {
            if (response.isOk)
                this.internshipTable.dataRows = response.data;
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
