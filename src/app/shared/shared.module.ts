import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { SharedRoutes } from './shared.routing';
import { IndexComponent } from './index/index.component';

/**
 * A shared module across app sections
 */
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule,
        RouterModule.forChild(SharedRoutes),
    ],
    declarations: [
        NotFoundComponent,
        IndexComponent
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        TranslateModule
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}

