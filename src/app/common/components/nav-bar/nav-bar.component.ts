import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn = false;

  tempCartItems = 3;

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.router.navigate([], {
      queryParams: { search: query || null },
      queryParamsHandling: 'merge',
    });
  }
}
