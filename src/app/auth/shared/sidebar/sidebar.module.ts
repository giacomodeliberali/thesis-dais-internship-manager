import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule
    ],
    declarations: [
        SidebarComponent
    ],
    exports: [
        SidebarComponent
    ]
})
export class SidebarModule { }
