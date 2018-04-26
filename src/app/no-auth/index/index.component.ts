import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NoAuthBasePage } from '../no-auth-base-page.model';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'index-cmp',
    templateUrl: './index.component.html'
})

export class IndexComponent extends NoAuthBasePage {

    constructor(element: ElementRef) {
        super(element);
    }
}
