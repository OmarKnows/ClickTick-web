import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CategoryRadioGroupComponent } from './category-radio-group/category-radio-group.component';
import { CardComponent } from '../../common/components/card/card.component';
import { PaginatorComponent } from '../../common/components/paginator/paginator.component';
import { ProductsService } from '../../services/products.service';
import { ICategory, IProduct } from '../../common/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CategoryRadioGroupComponent, CardComponent, PaginatorComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  pageTitle = 'Products';
  errorMessage: string | null = null;
  crumbs = 'Home / Products ';
  finalCrumb = signal<string | null>(null);
  products = signal<IProduct[] | undefined>(undefined);
  selectedCategory = signal<string | null>(null);
  totalPages = signal<number>(1);
  currentPage = signal<number>(1);

  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.listProducts();
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  listProducts(page: number = 1, category: string | null = null) {
    return this.productsService
      .listProducts(
        {
          page,
        },
        category
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
    this.listProducts(page);
  }

  onCategorySelected(category: ICategory | null) {
    if (category) {
      this.selectedCategory.set(category.slug);
      this.finalCrumb.set(category?.name);
    }
    this.listProducts(1, category?.slug);
  }
}
