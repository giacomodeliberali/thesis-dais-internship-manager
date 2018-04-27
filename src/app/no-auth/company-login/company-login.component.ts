import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FullScreenPage } from '../../models/full-screen-page.model';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'company-login-cmp',
    templateUrl: './company-login.component.html'
})
export class CompanyLoginComponent extends FullScreenPage {


    constructor(element: ElementRef) {
        super(element);
    }

    async login() {
        /* const googleUser = await this.authService.googleLogin();
        console.log(googleUser); */
    }
}
