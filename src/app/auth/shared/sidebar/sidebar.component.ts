import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { RoleType } from 'gdl-thesis-core/dist';
import { canExec } from '../../../helpers/can-exec.helper';

declare var $: any;
// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: 'sub' | 'link';
    icontype: string;
    children?: ChildrenItems[];
    requiredRoles?: Array<RoleType>
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
    requiredRoles?: Array<RoleType>
}

// Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/auth/internships/',
        title: 'Pages.Internships.Title',
        type: 'sub',
        icontype: 'ti-panel',
        children: [
            {
                path: 'list',
                title: 'Pages.Internships.ViewOffers',
                ab: 'L'
            },
            {
                path: 'add',
                title: 'Dictionary.Add',
                ab: 'A',
                requiredRoles: [
                    RoleType.Company
                ]
            }
        ]
    }
    /*     {
            path: '/charts',
            title: 'Dictionary.Charts',
            type: 'link',
            icontype: 'ti-gift'
    
        },
        {
            path: '/calendar',
            title: 'Dictionary.Calendar',
            type: 'link',
            icontype: 'ti-calendar'
        } */
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements AfterViewInit, OnInit {

    public menuItems: RouteInfo[] = ROUTES;

    constructor(
        public authService: AuthService) {
    }

    canExecute(requiredRoles: Array<RoleType>) {
        if (this.authService.currentUser)
            return canExec(this.authService.currentUser.role.type, requiredRoles);
        return false
    }

    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        let isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
    }

    ngAfterViewInit() {
        const $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();

        const collapseId = $sidebarParent.siblings('a').attr("href");

        $(collapseId).collapse("show");
    }

    public getTemplateString(str: string): string {
        return str.replace(/./g, 'a');
    }
}
