import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';


import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { NoAuthLayoutComponent } from './layouts/no-auth/no-auth-layout.component';
import { AppRoutes } from './app.routing';
import { ServiceLocator } from './services/service-locator.service';
import { BaseModule } from './services/base.module';
import { NavbarModule } from './auth/shared/navbar/navbar.module';
import { FooterModule } from './auth/shared/footer/footer.module';
import { FixedPluginModule } from './auth/shared/fixedplugin/fixedplugin.module';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SidebarModule } from './auth/shared/sidebar/sidebar.module';
import { TranslateService, MissingTranslationHandler, MissingTranslationHandlerParams, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createTranslateLoader } from './helpers/translateLoader.factory';
import { MyMissingTranslationHandler } from './services/my-missing-translation-handler.service';
import { NoAuthGuardService } from './services/no-auth-guard.service';
import { UsersService } from './services/user.service';
import { BaseService } from './services/base.service';
import { NotificationHelper } from './helpers/notification.helper';
import { InternshipsService } from './services/internships.service';
import { CompaniesService } from './services/companies.service';
import { EmailsService } from './services/emails.service';
import { InternshipProposalService } from './services/internships-proposal.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export function createNotificationHelper(translateService: TranslateService) {
    return new NotificationHelper(translateService);
}

/**
 * The app bootstrap module
 */
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpModule,
        SharedModule.forRoot(),
        SidebarModule,
        NavbarModule,
        FooterModule,
        FixedPluginModule,
        NgxDatatableModule
    ],
    declarations: [
        AppComponent,
        AuthLayoutComponent,
        NoAuthLayoutComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthService,
        AuthGuardService,
        NoAuthGuardService,
        BaseService,
        UsersService,
        InternshipsService,
        CompaniesService,
        EmailsService,
        InternshipProposalService,
        {
            provide: NotificationHelper,
            useFactory: createNotificationHelper,
            deps: [
                TranslateService
            ]
        }
    ]
})
export class AppModule extends BaseModule {
    constructor(
        injector: Injector,
        notificationHelper: NotificationHelper) {

        super(injector);
    }
}
