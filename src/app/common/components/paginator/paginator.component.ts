import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input() totalPages: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  currentPage: number = 1;
  visiblePages: number[] = [];

  ngOnInit() {
    // Initialize the visible pages
    this.updateVisiblePages();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update the visible pages when the total pages change
    if (changes['totalPages']) {
      this.updateVisiblePages();
    }
  }

  private updateVisiblePages() {
    // Calculate the visible pages based on the current page
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    this.visiblePages = [];
    for (let page = startPage; page <= endPage; page++) {
      this.visiblePages.push(page);
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage() {
    // Go to the next page if possible
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVisiblePages();
      this.pageChange.emit(this.currentPage);
      this.scrollToTop();
    }
  }

  previousPage() {
    // Go to the previous page if possible
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisiblePages();
      this.pageChange.emit(this.currentPage);
      this.scrollToTop();
    }
  }

  goToPage(page: number) {
    // Go to a specific page if possible
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateVisiblePages();
      this.pageChange.emit(this.currentPage);
      this.scrollToTop();
    }
  }
}
