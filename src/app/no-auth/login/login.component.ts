import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { NoAuthBasePage } from '../no-auth-base-page.model';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent extends NoAuthBasePage {

    public isLoading: boolean = false;

    constructor(
        element: ElementRef,
        private authService: AuthService,
        private router: Router) {

        super(element);
    }

    async login() {
        try {
            this.isLoading = true;
            const authResponse = await this.authService.googleLogin();
            console.log(authResponse);
            this.router.navigate(['/auth/dashboard'])
        } catch (ex) {
            console.error("Login error", ex);
            if (ex.error == "popup_blocked_by_browser")
                return Swal(
                    'Popup bloccato',
                    'Il tuo browser ha impedito al sistema di aprire il popup di login. Ti preghiamo di riprovare nuovamento il login!',
                    'warning');

            if (ex.error == "popup_closed_by_user")
                return Swal(
                    'Login annullato',
                    'Hai annullato il login',
                    'warning');

            Swal(
                'Login non riuscito',
                ex.error.exception.message,
                'error');
        } finally {
            this.isLoading = false;
        }
    }


}
