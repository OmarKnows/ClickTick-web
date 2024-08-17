import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ICart } from '../common/models/cart.model';
import { IResponse } from '../common/types';
import { EApi } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private httpClient = inject(HttpClient);

  getCart(id: number) {
    return this.httpClient
      .get<IResponse<ICart, 'carts'>>(`${EApi.CARTS}${EApi.USER}/${id}`)
      .pipe(
        tap((response) => console.log(response)),
        catchError((error: any) => {
          return throwError(() => new Error(error.message));
        })
      );
  }
}
