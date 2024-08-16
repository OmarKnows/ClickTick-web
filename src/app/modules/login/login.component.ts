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
  errorMessage: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: NgForm) {
    this.authService
      .login(form.value.username, form.value.password)
      .subscribe((success) => {
        if (success) {
          this.router.navigate([ERoutes.PRODUCTS]);
        } else {
          this.errorMessage = 'Invalid credentials';
        }
      });

    this.authService.login(form.value.username, form.value.password).subscribe({
      error: (err) => {
        console.error('Login failed', err);
      },
      complete: () => {
        this.router.navigate([this.productsUrl]);
      },
    });
  }
}
