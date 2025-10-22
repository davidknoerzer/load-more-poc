import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { ItemDetail } from './components/item-detail/item-detail';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'item/:id', component: ItemDetail },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
