import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FullScreenPage } from '../../models/full-screen-page.model';
import { User, Company } from 'gdl-thesis-core/dist';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CompaniesService } from '../../services/companies.service';
import { LoadingService } from '../../helpers/loading.helper';
import swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent extends FullScreenPage {

    public user: User;
    public company: Company;

    myform: any;

    constructor(
        element: ElementRef,
        private authService: AuthService,
        private companiesService: CompaniesService,
        private router: Router,
        private loadingService: LoadingService) {

        super(element);

        this.user = new User({
            registrationDate: new Date(),
            phone: []
        });

        this.company = new Company({
            registrationDate: new Date()
        });
    }

    ngOnInit() {
        this.myform = new FormGroup({
            name: new FormControl(this.user.name, [
                Validators.required
            ]),
            phone: new FormControl(this.user.phone[0], [
                Validators.required
            ]),
            companyName: new FormControl(this.company.name, [
                Validators.required
            ]),
            vatCode: new FormControl(this.company.vatCode, [
                Validators.required
            ]),
            email: new FormControl(this.user.email, [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*")
            ]),
            passwords: new FormGroup({
                password: new FormControl('', [
                    Validators.required,
                    Validators.minLength(8)
                ]),
                repeatPassword: new FormControl('')
            }, this.matchValidator)
        });
    }

    matchValidator(group: FormGroup) {

        const valid = group.controls['password'].value === group.controls['repeatPassword'].value;

        if (valid)
            return null;

        return {
            mismatch: true
        };
    }

    async signup() {

        try {
            this.loadingService.isLoading = true;
            const response = await this.authService.register(this.user);

            const user = response.data.user;

            this.company.owners = [
                user.id as any
            ];
            const company = await this.companiesService.create(this.company);

            this.router.navigate(['/auth/user/edit'])
        } catch (ex) {
            console.error("Login error", ex);
            swal(
                'Registrazione non riuscita',
                ex && ex.error && ex.error.exception ? ex.error.exception.message : ex.error,
                'error');
        } finally {
            this.loadingService.isLoading = false;
        }
    }
}
