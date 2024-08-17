import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { IAuthResponse } from '../common/models/auth.model';
import { EApi } from '../constants/api';
import { ELocalStorage } from '../constants/local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.isAuthenticatedSubject.next(this.hasValidToken());
    this.navigateIfAuthenticated();
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(ELocalStorage.ACCESS_TOKEN);
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return Math.floor(Date.now() / 1000) >= expiry;
    } catch (error) {
      return true;
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<IAuthResponse>(EApi.AUTH + EApi.LOGIN, { username, password })
      .pipe(
        map((response) => {
          const { token, refreshToken, ...userData } = response;
          this.storeTokens(token, refreshToken);
          this.storeUserData(userData);
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

  logout(): void {
    this.removeTokens();
    this.removeUserData();
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private navigateIfAuthenticated(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/products']);
    }
  }

  private setLocalStorage(key: string, value: string | null): void {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    this.setLocalStorage(ELocalStorage.ACCESS_TOKEN, accessToken);
    this.setLocalStorage(ELocalStorage.REFRESH_TOKEN, refreshToken);
  }

  private removeTokens(): void {
    this.setLocalStorage(ELocalStorage.ACCESS_TOKEN, null);
    this.setLocalStorage(ELocalStorage.REFRESH_TOKEN, null);
  }

  private storeUserData(
    userData: Omit<IAuthResponse, 'token' | 'refreshToken'>
  ): void {
    this.setLocalStorage(ELocalStorage.USER_DATA, JSON.stringify(userData));
  }

  private removeUserData(): void {
    this.setLocalStorage(ELocalStorage.USER_DATA, null);
  }
}
