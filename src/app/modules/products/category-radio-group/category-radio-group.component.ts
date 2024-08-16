import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { ICategory } from '../../../common/models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-category-radio-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-radio-group.component.html',
  styleUrl: './category-radio-group.component.scss',
})
export class CategoryRadioGroupComponent implements OnInit {
  categories = signal<ICategory[] | undefined>(undefined);
  errorMessage: string | null = null;
  @Output() categorySelected = new EventEmitter<ICategory>();

  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.listCategories();
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  listCategories() {
    return this.productsService.listCategories().subscribe({
      next: (response) => {
        this.categories.set(response);
      },
      error: () => {
        this.errorMessage = 'Failed to load categories';
      },
    });
  }

  onCategoryChange(category: ICategory) {
    this.categorySelected.emit(category);
  }
}
