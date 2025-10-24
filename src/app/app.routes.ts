import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'item/:id', component: ItemDetailComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
