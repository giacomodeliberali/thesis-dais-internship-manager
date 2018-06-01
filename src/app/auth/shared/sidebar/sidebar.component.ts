import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { RoleType, Role } from 'gdl-thesis-core/dist';
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
        path: '/',
        title: 'Dictionary.Home',
        type: 'link',
        icontype: 'ti-home'
    },
    {
        path: '/auth/internships/',
        title: 'Pages.InternshipOffers.Title',
        type: 'sub',
        icontype: 'fas fa-th-list',
        children: [
            {
                path: 'offers',
                title: 'Pages.InternshipOffers.ViewOffers',
                ab: 'L'
            },
            {
                path: 'add',
                title: 'Dictionary.AddInternship',
                ab: 'A',
                requiredRoles: [RoleType.Company]
            }
        ]
    },
    {
        path: '/auth/',
        title: 'Dictionary.Student',
        type: 'sub',
        icontype: 'fas fa-user-graduate',
        requiredRoles: [
            RoleType.Student
        ],
        children: [
            {
                path: 'proposals/student',
                title: 'Dictionary.MyProposals',
                ab: 'P'
            }
        ]
    },
    {
        path: '/auth/',
        title: 'Pages.InternshipOwnCompany.Title',
        type: 'sub',
        icontype: 'fas fa-briefcase',
        requiredRoles: [
            RoleType.Company
        ],
        children: [
            {
                path: 'internships/company',
                title: 'Dictionary.OwnInternships',
                ab: 'M'
            },
            {
                path: 'proposals/company',
                title: 'Pages.CompanyInternshipProposals.MenuItem',
                ab: 'P'
            }
        ]
    },
    {
        path: '/auth/',
        title: 'Dictionary.Professor',
        type: 'sub',
        icontype: 'fas fa-user-graduate',
        requiredRoles: [
            RoleType.Professor
        ],
        children: [
            {
                path: 'internships/approve',
                title: 'Dictionary.WaitForApproval',
                ab: 'I'
            },
            {
                path: 'proposals/professor',
                title: 'Dictionary.StudentsWaitForApproval',
                ab: 'S'
            }
        ]
    }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements AfterViewInit, OnInit {

    public menuItems: RouteInfo[] = ROUTES;

    constructor(
        public authService: AuthService,
        private router: Router) {
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

    /**
     * Determine if the current menu item has at least an active child
     * @param menuItem The parent menu item
     */
    isActive(menuItem: RouteInfo): boolean {
        let isActive = false;
        if (menuItem.children)
            menuItem.children.forEach(c => {
                isActive = isActive || this.router.isActive(menuItem.path + c.path, true);
            });
        else
            isActive = this.router.isActive(menuItem.path, true);
        return isActive;
    }
}
