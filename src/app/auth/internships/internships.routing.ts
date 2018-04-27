import { Routes } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { StatsComponent } from './stats/stats.component';
import { generateAuthRoute } from '../../helpers/generate.auth-route.helper';

export const InternshipsRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
    },
    {
        path: '',
        children: [
            generateAuthRoute('overview', OverviewComponent),
            generateAuthRoute('stats', StatsComponent)
        ]
    }
];
