import { IProduct } from '../../common/models/product.model';

export const products: IProduct[] = [
  {
    id: 1,
    title: 'iPhone',
    price: 1000,
    brand: 'Apple',
    category: 'Smart Phones',
    description: 'iPhone 12 Pro Max',
    discountPercentage: 5,
    rating: 4.5,
    reviews: [
      {
        rating: 4,
        comment: 'Good',
        date: '2021-07-01',
        reviewerName: 'John',
        reviewerEmail: '',
      },
    ],
    stock: 0,
    thumbnail: '',
  },
];
