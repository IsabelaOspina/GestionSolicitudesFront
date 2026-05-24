import { Routes } from '@angular/router';

import { LoginComponent } from './Components/login/login.component';
import { AdminComponent } from './Components/admin/admin.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'admin',
    component: AdminComponent
  }

];