import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

  constructor() {
    this.isAuthenticatedSubject.next(this.hasToken());
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(ELocalStorage.ACCESS_TOKEN);
    return !!token && !this.isTokenExpired(ELocalStorage.ACCESS_TOKEN);
  }

  private isTokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<IAuthResponse>(EApi.AUTH + EApi.LOGIN, {
        username,
        password,
      })
      .pipe(
        map((response) => {
          this.storeTokens(response.token, response.refreshToken);
          this.isAuthenticatedSubject.next(true);
          return true;
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.removeTokens();
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ELocalStorage.ACCESS_TOKEN, accessToken);
    localStorage.setItem(ELocalStorage.REFRESH_TOKEN, refreshToken);
  }

  private removeTokens(): void {
    localStorage.removeItem(ELocalStorage.ACCESS_TOKEN);
    localStorage.removeItem(ELocalStorage.REFRESH_TOKEN);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(ELocalStorage.ACCESS_TOKEN);
  }
}
