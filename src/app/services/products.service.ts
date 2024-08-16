import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { IProduct } from '../common/models/product.model';
import { IPaginationParams, IResponse } from '../common/types';
import { EApi } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private httpClient = inject(HttpClient);

  listProducts(params?: IPaginationParams) {
    return this.httpClient
      .get<IResponse<IProduct, 'products'>>(EApi.PRODUCTS)
      .pipe(
        tap((response) => {
          console.log(response.products);
        }),
        catchError((error: any) => {
          console.log(error);
          return throwError(() => new Error('An error occurred'));
        })
      );
  }
}
