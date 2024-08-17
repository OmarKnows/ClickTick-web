import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryRadioGroupComponent } from './category-radio-group/category-radio-group.component';
import { CardComponent } from '../../common/components/card/card.component';
import { PaginatorComponent } from '../../common/components/paginator/paginator.component';
import { ProductsService } from '../../services/products.service';
import { ICategory, IProduct } from '../../common/models/product.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CategoryRadioGroupComponent, CardComponent, PaginatorComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private searchQuerySubject = new Subject<string | null>();
  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  pageTitle = 'Products';
  errorMessage: string | null = null;
  crumbs = 'Home / Products ';
  finalCrumb = signal<string>('');
  products = signal<IProduct[] | undefined>(undefined);
  selectedCategory = signal<string | null>(null);
  totalPages = signal<number>(1);
  currentPage = signal<number>(1);
  searchQuery = signal<string | null>(null);

  ngOnInit(): void {
    const subscription = this.route.queryParams.subscribe((params) => {
      const search = params['search'] || null;
      this.searchQuery.set(search);
      this.searchQuerySubject.next(search);
    });

    this.searchQuerySubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.listProducts(1, this.selectedCategory(), query);
      });

    if (!this.searchQuery()) {
      this.listProducts();
    }

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  listProducts(
    page: number = 1,
    category: string | null = null,
    search: string | null = null
  ) {
    return this.productsService
      .listProducts(
        {
          page,
        },
        category,
        search
      )
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.totalPages.set(response.total);
        },
        error: () => {
          this.errorMessage = 'Failed to load products';
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.listProducts(page, this.selectedCategory(), this.searchQuery());
  }

  onCategorySelected(category: ICategory) {
    this.finalCrumb.set(category?.name);
    this.selectedCategory.set(category.slug);
    this.listProducts(1, category?.slug, this.searchQuery());
  }
}
