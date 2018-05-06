import { Component, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FullScreenPage } from '../../models/full-screen-page.model';
import { LoadingHelper } from '../../helpers/loading.helper';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent extends FullScreenPage {

    constructor(
        element: ElementRef,
        private authService: AuthService,
        private router: Router) {

        super(element);
    }

    async login() {
        try {
            LoadingHelper.isLoading = true;
            const authResponse = await this.authService.googleLogin();
            if (authResponse.isNew)
                this.router.navigate(['/auth/user/edit'])
            else
                this.router.navigate(['/auth'])
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
                ex && ex.error && ex.error.exception ? ex.error.exception.message : ex.error,
                'error');
        } finally {
            LoadingHelper.isLoading = false;
        }
    }


}
