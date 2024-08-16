import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { categories } from './tempCategories';

@Component({
  selector: 'app-category-radio-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-radio-group.component.html',
  styleUrl: './category-radio-group.component.scss',
})
export class CategoryRadioGroupComponent {
  tempCategories = categories;
}
