import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ERoutes } from '../../constants/routes';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  productsUrl = ERoutes.PRODUCTS;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: NgForm) {
    console.log(form);
    this.authService.login(form.value.username, form.value.password).subscribe({
      next: () => {
        this.router.navigate([ERoutes.PRODUCTS]);
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
