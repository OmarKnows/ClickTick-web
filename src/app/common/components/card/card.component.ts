import { Component, inject, input } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { addToCart } from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  product = input.required<IProduct>();
  store = inject(Store);

  getStarWidth(rating: number): number {
    return (rating / 5) * 100;
  }

  getDiscountedPrice(price: number, discount: number): number {
    const discountedPrice = price - (price * discount) / 100;
    return parseFloat(discountedPrice.toFixed(2));
  }

  onAddToCart(productId: number) {
    this.store.dispatch(addToCart());
  }
}
