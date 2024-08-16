import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ERoutes } from '../constants/routes';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuth) => {
        if (isAuth) {
          return true;
        } else {
          this.router.navigate([ERoutes.LOGIN]);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate([ERoutes.LOGIN]);
        return of(false);
      })
    );
  }
}
