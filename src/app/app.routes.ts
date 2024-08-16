import { Routes } from '@angular/router';
import { ERoutes } from './constants/routes';
import { LoginComponent } from './modules/login/login.component';
import { ProductsComponent } from './modules/products/products.component';

export const routes: Routes = [
  {
    path: ERoutes.LOGIN,
    component: LoginComponent,
  },
  {
    path: ERoutes.PRODUCTS,
    component: ProductsComponent,
  },
];
