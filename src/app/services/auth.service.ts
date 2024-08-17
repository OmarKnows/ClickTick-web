import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { IAuthResponse } from '../common/models/auth.model';
import { EApi } from '../constants/api';
import { ELocalStorage } from '../constants/local-storage';
import { ERoutes } from '../constants/routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    // Check if the user is authenticated when the service is initialized
    this.navigateIfAuthenticated();
  }

  // Return an observable that emits the authentication status
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Login the user and store the tokens in the local storage and navigate to the products page
  login(username: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<IAuthResponse>(EApi.AUTH + EApi.LOGIN, { username, password })
      .pipe(
        map(({ token, refreshToken, ...userData }) => {
          localStorage.setItem(ELocalStorage.ACCESS_TOKEN, token);
          localStorage.setItem(ELocalStorage.REFRESH_TOKEN, refreshToken);
          localStorage.setItem(
            ELocalStorage.USER_DATA,
            JSON.stringify(userData)
          );
          this.isAuthenticatedSubject.next(true);
          this.navigateIfAuthenticated();
          return true;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  // Logout the user by removing the tokens from the local storage and navigate to the login page
  logout(): void {
    localStorage.removeItem(ELocalStorage.ACCESS_TOKEN);
    localStorage.removeItem(ELocalStorage.REFRESH_TOKEN);
    localStorage.removeItem(ELocalStorage.USER_DATA);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate([ERoutes.LOGIN]);
  }

  // Check if the token is valid by decoding it and comparing the expiration time
  private hasValidToken(): boolean {
    const token = localStorage.getItem(ELocalStorage.ACCESS_TOKEN);
    return !!token && !this.isTokenExpired(token);
  }

  // Decode the token and check if it's expired
  private isTokenExpired(token: string): boolean {
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      return Math.floor(Date.now() / 1000) >= exp;
    } catch {
      return true;
    }
  }

  // Navigate to the products page if the user is authenticated
  private navigateIfAuthenticated(): void {
    if (this.hasValidToken()) {
      this.router.navigate([ERoutes.PRODUCTS]);
    }
  }
}
