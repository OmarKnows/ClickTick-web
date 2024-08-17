import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { ELocalStorage } from '../../../constants/local-storage';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);

  cartItems = signal<number>(0);
  isLoggedIn = signal<boolean>(false);

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      this.isLoggedIn.set(isAuth);

      if (this.isLoggedIn()) {
        const userId = this.getUserIdFromLocalStorage();
        if (userId) {
          this.getCart(userId);
        }
      }
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.router.navigate([], {
      queryParams: { search: query || null },
      queryParamsHandling: 'merge',
    });
  }

  private getCart(userId: number) {
    this.cartService.getCart(userId).subscribe({
      next: (response) => {
        this.cartItems.set(response.carts[1]?.products?.length);
        console.log('Cart data retrieved:', response);
      },
      error: (error) => {
        console.error('Error fetching cart data:', error);
      },
    });
  }

  private getUserIdFromLocalStorage(): number | null {
    const userData = localStorage.getItem(ELocalStorage.USER_DATA);
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
    return null;
  }
}
