import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { SharedRoutes } from './shared.routing';
import { IndexComponent } from './index/index.component';
import { createTranslateLoader } from '../helpers/translateLoader.factory';
import { MyMissingTranslationHandler } from '../services/my-missing-translation-handler.service';

/**
 * A shared module across app sections
 */
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [
                    HttpClient
                ]
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: MyMissingTranslationHandler
            },
            isolate: false
        }),
        RouterModule.forChild(SharedRoutes)
    ],
    declarations: [
        NotFoundComponent,
        IndexComponent
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        TranslateModule
    ],
    providers: [
        TranslateService
    ]
})
export class SharedModule {

    constructor(private translate: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('it');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        let currentLanguage = localStorage.getItem("default:culture") || "it";

        // if the current lang is not it or en, fallback to it
        if (!['it', 'en'].includes(currentLanguage))
            currentLanguage = "it";

        // update local storage value
        localStorage.setItem("default:culture", currentLanguage);

        // use the value
        translate.use(currentLanguage);
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}

