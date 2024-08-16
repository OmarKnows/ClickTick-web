import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { EApi } from '../constants/api';
import { ELocalStorage } from '../constants/local-storage';
import { IAuthResponse } from '../common/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  login(email: string, password: string) {
    return this.httpClient
      .post<IAuthResponse>(EApi.AUTH + '/login', {
        email,
        password,
      })
      .pipe(
        tap((response: IAuthResponse) => {
          console.log(response);
          localStorage.setItem(ELocalStorage.ACCESS_TOKEN, response.token);
          localStorage.setItem(
            ELocalStorage.REFRESH_TOKEN,
            response.refreshToken
          );
        }),
        catchError((error: any) => {
          console.log(error);
          return throwError(
            () => new Error('An error occurred while logging in')
          );
        })
      );
  }

  logout() {
    localStorage.removeItem(ELocalStorage.ACCESS_TOKEN);
    localStorage.removeItem(ELocalStorage.REFRESH_TOKEN);
  }
}
