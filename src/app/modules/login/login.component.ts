import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ERoutes } from '../../constants/routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  productsUrl = ERoutes.PRODUCTS;
}
