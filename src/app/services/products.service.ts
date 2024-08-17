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
    // Construct the URL based on the parameters
    let urlParts: string[] = [EApi.PRODUCTS];

    // Add the search query and category to the URL if they exist
    if (search) {
      urlParts.push(`/search?q=${search}`);
    }

    // Add the category to the URL if it exists
    if (category) {
      urlParts.push(`/category/${category}`);
    }

    const queryParams = new URLSearchParams();

    // Add the pagination parameters to the URL if they exist
    if (params?.page && params.page > 1) {
      queryParams.set('skip', `${(params.page - 1) * 10}`);
    }

    // Add the URL parameters to the URL
    const url = `${urlParts.join('')}${
      queryParams.toString() ? '?' + queryParams : ''
    }`;

    // Fetch the products from the API
    const cachedResponse = this.cachingService.get(url);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      return this.httpClient.get<IResponse<IProduct, 'products'>>(url).pipe(
        tap((response) => this.cachingService.set(url, response)),
        catchError((error: any) => throwError(() => new Error(error.message)))
      );
    }
  }

  // Fetch the categories from the API
  listCategories() {
    return this.httpClient.get<ICategory[]>(EApi.PRODUCTS + EApi.CATEGORIES);
  }
}
