import { Routes } from '@angular/router';
import { ROUTES } from './constants/routes';
import { LoginComponent } from './modules/login/login.component';
import { ProductsComponent } from './modules/products/products.component';

export const routes: Routes = [
  {
    path: ROUTES.LOGIN,
    component: LoginComponent,
  },
  {
    path: ROUTES.PRODUCTS,
    component: ProductsComponent,
  },
];
