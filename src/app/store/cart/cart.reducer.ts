import { createReducer, on } from '@ngrx/store';
import { addToCart } from './cart.actions';

//since the backend capabilities are limited, we are simply incrementing the quantity of the product in the cart
//typically there would be an endpoint to add to the cart and more than just the item quantity would be in the store
//this would be handled with effects

const initialState = 0;

export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state) => state + 1)
);
