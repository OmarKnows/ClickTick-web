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

  listProducts(
    params?: IPaginationParams,
    category?: string | null,
    search?: string | null
  ) {
    let urlParts: string[] = [EApi.PRODUCTS];

    if (search) {
      urlParts.push(`/search?q=${search}`);
    }

    if (category) {
      urlParts.push(`/category/${category}`);
    }

    const queryParams = new URLSearchParams();

    if (params?.page && params.page > 1) {
      queryParams.set('skip', `${(params.page - 1) * 10}`);
    }

    const url = `${urlParts.join('')}${
      queryParams.toString() ? '?' + queryParams : ''
    }`;

    return this.fetchAndCacheData<IResponse<IProduct, 'products'>>(url);
  }

  listCategories() {
    const url = `${EApi.PRODUCTS}${EApi.CATEGORIES}`;
    return this.fetchAndCacheData<ICategory[]>(url);
  }

  private fetchAndCacheData<T>(url: string) {
    const cachedResponse = this.cachingService.get(url);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      return this.httpClient.get<T>(url).pipe(
        tap((response) => this.cachingService.set(url, response)),
        catchError((error: any) => throwError(() => new Error(error.message)))
      );
    }
  }
}
