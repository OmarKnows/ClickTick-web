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

  //this function is responsible of changing the rating to a percentage
  //this percentage is then used to crop the yellow star
  //the yellow star is placed ontop of the gray star
  //this ends up giving the illusion that there is 1 star partially yellow and partially gray
  getClipPath(rating: number): string {
    const percentage = (rating / 5) * 100;
    return `inset(0 ${100 - percentage}% 0 0)`;
  }

  getDiscountedPrice(price: number, discount: number): number {
    const discountedPrice = price - (price * discount) / 100;
    return parseFloat(discountedPrice.toFixed(2));
  }

  //this function simply increments the quantity of the product in the cart
  //since there is no endpoint to add to the cart, we are simply incrementing the quantity
  onAddToCart(productId: number) {
    this.store.dispatch(addToCart());
  }
}
