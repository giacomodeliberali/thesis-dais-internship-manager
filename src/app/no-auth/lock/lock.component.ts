import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FullScreenPage } from '../../models/full-screen-page.model';

declare var $:any;

@Component({
    moduleId:module.id,
    selector: 'lock-cmp',
    templateUrl: './lock.component.html'
})

export class LockComponent  extends FullScreenPage {
    constructor(element: ElementRef) {
        super(element);
    }
}
