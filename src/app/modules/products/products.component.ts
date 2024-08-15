import { Component } from '@angular/core';
import { CategoryRadioGroupComponent } from './category-radio-group/category-radio-group.component';
import { products } from './tempProducts';
import { CardComponent } from '../../common/components/card/card.component';
import { PaginatorComponent } from '../../common/components/paginator/paginator.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CategoryRadioGroupComponent, CardComponent, PaginatorComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  pageTitle = 'Products';
  crumbs = 'Home / Products / Smart Phones / iPhone';
  tempProducts = products;
}
