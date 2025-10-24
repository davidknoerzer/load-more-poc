import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RestoreScrollingDirective } from '../../directives/restore-scrolling.directive';
import { Item, ItemService } from '../../services/item.service';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ItemCardComponent, RestoreScrollingDirective],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // --- State Properties ---
  isLoading = false;
  allItemsLoaded = false;
  itemsPerPage = 24;

  // --- RxJS Streams for State Management ---
  items$ = new BehaviorSubject<Item[]>([]);

  private currentPage = 1; // will be updated based on cached data
  private readonly itemService = inject(ItemService);

  ngOnInit(): void {
    // Restore cached items if available
    const cachedItems = this.itemService.getCachedItems();
    if (cachedItems.length > 0) {
      this.items$.next(cachedItems);

      // Calculate next page to load based on cached items
      this.currentPage = Math.floor(cachedItems.length / this.itemsPerPage) + 1;

      // Check if we already loaded all items
      if (cachedItems.length === 100) {
        // total items known
        this.allItemsLoaded = true;
      }
    } else {
      // First load
      this.loadMore();
    }
  }

  loadMore(): void {
    if (this.isLoading || this.allItemsLoaded) return;

    this.isLoading = true;

    this.itemService.getPage(this.currentPage, this.itemsPerPage).subscribe({
      next: (newItems) => {
        const currentItems = this.items$.getValue();
        this.items$.next([...currentItems, ...newItems]); // append new items

        if (newItems.length < this.itemsPerPage) {
          this.allItemsLoaded = true; // no more items to load
        }

        this.currentPage++;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading items', err);
        this.isLoading = false;
      },
    });
  }
}
