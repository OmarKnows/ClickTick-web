import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CategoryRadioGroupComponent } from './category-radio-group/category-radio-group.component';
import { products } from './tempProducts';
import { CardComponent } from '../../common/components/card/card.component';
import { PaginatorComponent } from '../../common/components/paginator/paginator.component';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../common/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CategoryRadioGroupComponent, CardComponent, PaginatorComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  pageTitle = 'Products';
  crumbs = 'Home / Products / Smart Phones / iPhone';
  products = signal<IProduct[] | undefined>(undefined);
  totalPages = signal<number>(1);

  tempProducts = products;

  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.listProducts();
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  listProducts() {
    return this.productsService.listProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.totalPages.set(response.total);
      },
      error: (error: Error) => {},
    });
  }
}
