import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'admin',
    component: LoginComponent
  },

  {
    path: 'administrativo',
    component: LoginComponent
  },

  {
    path: 'solicitudes',
    component: LoginComponent
  }
];