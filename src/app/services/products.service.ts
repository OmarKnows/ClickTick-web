import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ICategory, IProduct } from '../common/models/product.model';
import { IPaginationParams, IResponse } from '../common/types';
import { EApi } from '../constants/api';
import { CachingService } from './caching.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private httpClient = inject(HttpClient);
  private cachingService = inject(CachingService);

  listProducts(params?: IPaginationParams, category?: string | null) {
    let url = `${EApi.PRODUCTS}`;

    if (category) {
      url = `${url}/category/${category}`;
    }

    if (params?.page && params.page > 1) {
      url = `${url}?skip=${(params.page - 1) * 10}`;
    }

    const cachedResponse = this.cachingService.get(url);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      return this.httpClient.get<IResponse<IProduct, 'products'>>(url).pipe(
        tap((response) => this.cachingService.set(url, response)),
        catchError((error: any) => {
          return throwError(() => new Error(error.message));
        })
      );
    }
  }

  listCategories() {
    const url = EApi.PRODUCTS + EApi.CATEGORIES;
    const cachedResponse = this.cachingService.get(url);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      return this.httpClient.get<ICategory[]>(url).pipe(
        tap((response) => this.cachingService.set(url, response)),
        catchError((error: any) => {
          return throwError(() => new Error(error.message));
        })
      );
    }
  }
}
