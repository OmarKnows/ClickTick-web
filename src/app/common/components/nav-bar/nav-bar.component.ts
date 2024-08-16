import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  authService = inject(AuthService);
  isLoggedIn = false;

  tempCartItems = 3;

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
    });
  }
}
