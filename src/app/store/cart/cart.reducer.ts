import { createReducer, on } from '@ngrx/store';
import { addToCart } from './cart.actions';

const initialState = 0;

export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state) => state + 1)
);
