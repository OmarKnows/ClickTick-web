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
    let skip = 0;
    if (params?.page) {
      params.page > 1 ? (skip = (params.page - 1) * 10) : (skip = 0);
    }
    return this.httpClient
      .get<IResponse<IProduct, 'products'>>(
        EApi.PRODUCTS + `${skip > 1 ? `?skip=${skip}` : ''}`
      )
      .pipe(
        catchError((error: any) => {
          console.log(error);
          return throwError(() => new Error('An error occurred'));
        })
      );
  }
}
