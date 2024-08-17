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
    this.updateVisiblePages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalPages']) {
      this.updateVisiblePages();
    }
  }

  private updateVisiblePages() {
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
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVisiblePages();
      this.pageChange.emit(this.currentPage);
      this.scrollToTop();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisiblePages();
      this.pageChange.emit(this.currentPage);
      this.scrollToTop();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateVisiblePages();
      this.pageChange.emit(this.currentPage);
      this.scrollToTop();
    }
  }
}
