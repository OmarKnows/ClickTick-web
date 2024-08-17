import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private cache = new Map<string, any>();

  constructor() {}

  // Get the value from the cache if it exists
  get(key: string): Observable<any> | null {
    return this.cache.get(key) ? of(this.cache.get(key)) : null;
  }

  // Set the value in the cache
  set(key: string, value: any): void {
    this.cache.set(key, value);
  }
}
