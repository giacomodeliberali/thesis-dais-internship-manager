import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { IndexComponent } from './index/index.component';


/**
 * The routes that a not authenticated user can reach
 */
export const SharedRoutes: Routes = [
    {
        path: 'index',
        component: IndexComponent
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    }
];
