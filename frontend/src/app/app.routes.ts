import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CrossSellComponent } from './components/cross-sell/cross-sell.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: CrossSellComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
