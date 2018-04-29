import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ROUTES, RouteInfo } from '../sidebar/sidebar.component';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

var misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {

    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    public title: Observable<string>;

    @ViewChild("navbar-cmp") button;

    constructor(
        private location: Location,
        private renderer: Renderer,
        private element: ElementRef,
        private translateService: TranslateService,
        private router: Router) {

        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

        this.router.events.subscribe(e => {
            this.getTitle();
        });
    }

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            var $btn = $(this);

            if (misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    }

    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    }

    sidebarOpen() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    }
    sidebarClose() {
        var body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }
    sidebarToggle() {
        // var toggleButton = this.toggleButton;
        // var body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible == false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    getTitle() {
        let currentRouteTitle = 'Pages.User.ViewProfile';

        ROUTES.forEach(r => {
            if (r.path == this.location.path()) {
                currentRouteTitle = r.title;
                return true;
            }


            if (r.children) {
                for (let index in r.children) {
                    if (`${r.path}${r.children[index].path}` == this.location.path()) {
                        currentRouteTitle = r.children[index].title;
                        return true;
                    }
                }
            }
        });
        this.title = this.translateService.get(currentRouteTitle);
    }
}
