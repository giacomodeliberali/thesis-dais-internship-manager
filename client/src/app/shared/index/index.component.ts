import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FullScreenPage } from '../../models/full-screen-page.model';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../helpers/loading.helper';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'index-cmp',
    templateUrl: './index.component.html'
})

export class IndexComponent extends FullScreenPage {

    public currentLanguage: string;

    constructor(
        element: ElementRef,
        private translateService: TranslateService,
        private loadingService: LoadingService) {
        super(element);

        this.currentLanguage = this.translateService.currentLang;
    }

    onChangeLanguage(lang: string) {
        this.loadingService.isLoading = true;
        this.currentLanguage = lang;
        console.log("Use " + this.currentLanguage);
        localStorage.setItem('default:culture', this.currentLanguage);
        window.location.reload();
    }
}
