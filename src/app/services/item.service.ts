import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Item {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private allItems: Item[] = [];
  private cachedItems: Item[] = []; // items already fetched
  private lastPageFetched = 0; // last page that has been fetched

  constructor() {
    // Generate 100 dummy items
    for (let i = 1; i <= 100; i++) {
      this.allItems.push({
        id: i,
        title: `Research Item #${i}`,
        description: `This is a detailed description for item number ${i}.`,
        imageUrl: `https://picsum.photos/seed/${i}/300/200`,
      });
    }
  }

  /**
   * Fetch a page of items.
   * Uses cached data if the page has already been fetched.
   */
  getPage(page: number, limit: number): Observable<Item[]> {
    // If the page has already been fetched, return cached items
    if (page <= this.lastPageFetched) {
      const start = (page - 1) * limit;
      const end = start + limit;
      return of(this.cachedItems.slice(start, end));
    }

    // Otherwise, fetch new items and cache them
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const newItems = this.allItems.slice(startIndex, endIndex);

    this.cachedItems = [...this.cachedItems, ...newItems];
    this.lastPageFetched = page;

    // Simulate network latency
    return of(newItems).pipe(delay(500));
  }

  /**
   * Get all items currently cached in the frontend.
   */
  getCachedItems(): Item[] {
    return this.cachedItems;
  }

  /**
   * Fetch a single item by ID.
   * Returns cached item if available, otherwise fetches from allItems.
   */
  getItemById(id: number): Observable<Item | undefined> {
    const cached = this.cachedItems.find((item) => item.id === id);
    if (cached) return of(cached);

    const foundItem = this.allItems.find((item) => item.id === id);
    return of(foundItem).pipe(delay(100)); // simulate quick fetch
  }
}
