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
  errorMessage: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: NgForm) {
    // Login the user and navigate to the products page
    this.authService
      .login(form.value.username, form.value.password)
      .subscribe();
  }
}
