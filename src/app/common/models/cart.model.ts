import { IProduct } from './product.model';

interface ICartProduct
  extends Omit<
    IProduct,
    'description' | 'category' | 'rating' | 'stock' | 'brand' | 'reviews'
  > {
  quantity: number;
  total: number;
  discountedTotal: number;
}

export interface ICart {
  id: number;
  products: ICartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}
