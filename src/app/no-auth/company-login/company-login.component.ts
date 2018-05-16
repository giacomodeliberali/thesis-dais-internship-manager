import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FullScreenPage } from '../../models/full-screen-page.model';
import { LoadingService } from '../../helpers/loading.helper';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'company-login-cmp',
    templateUrl: './company-login.component.html'
})
export class CompanyLoginComponent extends FullScreenPage {

    public email: string;
    public password: string;


    constructor(element: ElementRef,
        private authService: AuthService,
        private router: Router,
        private loadingService: LoadingService) {

        super(element);
    }

    async login() {
        try {
            this.loadingService.isLoading = true;
            const authResponse = await this.authService.login(this.email, this.password);
            if (authResponse.data.isNew)
                this.router.navigate(['/auth/user/edit'])
            else
                this.router.navigate(['/auth'])
        } catch (ex) {
            console.error("Login error", ex);
            if (ex.error == "auth/bad-login")
                return swal(
                    'Login non riuscito',
                    'Le credenziali immesse non sono corrette',
                    'warning');

            swal(
                'Login non riuscito',
                ex && ex.error && ex.error.exception ? ex.error.exception.message : ex.error,
                'error');
        } finally {
            this.loadingService.isLoading = false;
        }
    }
}
