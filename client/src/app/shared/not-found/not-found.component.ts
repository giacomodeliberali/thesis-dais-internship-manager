import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FullScreenPage } from '../../models/full-screen-page.model';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'not-found-cmp',
    templateUrl: './not-found.component.html'
})

export class NotFoundComponent extends FullScreenPage {
    constructor(element: ElementRef) {
        super(element);
    }
}
