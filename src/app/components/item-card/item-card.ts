import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Item } from '../../services/item';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-card.html',
})
export class ItemCard {
  item = input.required<Item>();
  private router = inject(Router);

  // Pass currentPage from the parent (Dashboard)
  currentPage = input<number>(1);

  /**
   * IMPORTANT: We have to save the current history state when we leave the current page for a correct page history
   */

  goToDetail(itemId: number) {
    // Save scroll position + pagination state before leaving
    history.replaceState(
      {
        ...history.state,
        scrollY: window.scrollY,
        currentPage: this.currentPage(),
      },
      ''
    );

    // Navigate programmatically
    this.router.navigate(['/item', itemId]);
  }
}
