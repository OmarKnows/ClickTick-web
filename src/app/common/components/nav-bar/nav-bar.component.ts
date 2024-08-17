import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ERoutes } from '../../../constants/routes';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  store = inject(Store);

  isLoggedIn = signal<boolean>(false);
  cartItems$: Observable<number>;

  constructor() {
    //setting the cart items from the ngrx store
    this.cartItems$ = this.store.select('cart');
  }

  ngOnInit(): void {
    //checking if the user is authenticated
    this.authService.isAuthenticated().subscribe((isAuth) => {
      this.isLoggedIn.set(isAuth);
    });
  }

  onSearch(event: Event) {
    //when the user types in the search bar, we are update the query parameter
    const query = (event.target as HTMLInputElement).value;
    this.router.navigate([], {
      queryParams: { search: query || null },
      queryParamsHandling: 'merge',
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate([ERoutes.LOGIN]);
  }
}
