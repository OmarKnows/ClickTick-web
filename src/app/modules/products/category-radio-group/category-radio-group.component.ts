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
  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);
  @Output() categorySelected = new EventEmitter<ICategory>();
  categories = signal<ICategory[] | undefined>(undefined);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Load the categories when the component is initialized
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
        this.errorMessage.set('Failed to load categories');
      },
    });
  }

  onCategoryChange(category: ICategory) {
    // Emit the selected category for the filter to listen
    this.categorySelected.emit(category);
  }
}
