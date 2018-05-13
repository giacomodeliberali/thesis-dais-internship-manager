import { Component } from '@angular/core';
import { InternshipsService } from '../../../services/internships.service';
import { NotificationHelper } from '../../../helpers/notification.helper';
import { DatePipe } from '@angular/common';
import { InternshipProposalService } from '../../../services/internships-proposal.service';
import { AuthService } from '../../../services/auth.service';

declare var $;

@Component({
    selector: 'internships-students-list-cmp',
    templateUrl: './internships-students-list.component.html'
})
export class InternshipsStudentsListComponent {

    internshipTable = {
        headerRow: [
            { name: 'Dictionary.Student', value: 'student.name' },
            { name: 'Dictionary.Company', value: 'internship.company.name' },
            { name: 'Dictionary.StartDate', value: 'internship.startDate', class: 'text-center', pipe: DatePipe },
            { name: 'Dictionary.EndDate', value: 'internship.endDate', class: 'text-center', pipe: DatePipe },
        ] as Array<any>,
        dataRows: []
    };

    public isLoading = true;

    constructor(
        private authService: AuthService,
        private internshipProposalService: InternshipProposalService) {

        this.internshipProposalService.getPendingStudents(this.authService.currentUser.id).then(response => {
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
