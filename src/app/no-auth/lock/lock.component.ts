import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NoAuthBasePage } from '../no-auth-base-page.model';

declare var $:any;

@Component({
    moduleId:module.id,
    selector: 'lock-cmp',
    templateUrl: './lock.component.html'
})

export class LockComponent  extends NoAuthBasePage {
    constructor(element: ElementRef) {
        super(element);
    }
}
