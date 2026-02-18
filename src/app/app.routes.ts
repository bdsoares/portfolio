import { Routes } from '@angular/router';
import { PortfolioPageComponent } from './features/portfolio/pages/portfolio-page.component';

export const routes: Routes = [
  {
    path: '',
    component: PortfolioPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
