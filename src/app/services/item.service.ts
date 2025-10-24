import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Item {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface PagedItemsResponse {
  totalCountOfItems: number;
  countOfItems: number;
  items: Item[];
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private allItems: Item[] = [];
  private cachedItems: Item[] = []; // items already fetched
  private lastPageFetched = 0; // last page that has been fetched
  totalNumberOfItems = signal<number>(0);

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

    this.totalNumberOfItems.set(this.allItems.length);
  }

  /**
   * Fetch a page of items, returns a PagedItemsResponse.
   * Uses cached data if the page has already been fetched.
   */
  getPage(page: number, limit: number): Observable<PagedItemsResponse> {
    const total = this.totalNumberOfItems();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    let items: Item[] = [];

    // Return cached items if this page was already fetched
    if (page <= this.lastPageFetched) {
      items = this.cachedItems.slice(startIndex, endIndex);
    } else {
      items = this.allItems.slice(startIndex, endIndex);
      this.cachedItems = [...this.cachedItems, ...items];
      this.lastPageFetched = page;
    }

    const response: PagedItemsResponse = {
      totalCountOfItems: total,
      countOfItems: items.length,
      items,
    };

    // Simulate network latency
    return of(response).pipe(delay(500));
  }

  /**
   * Get all items currently cached in the frontend.
   */
  getCachedItems(): Item[] {
    return this.cachedItems;
  }

  /**
   * Fetch a single item by ID.
   */
  getItemById(id: number): Observable<Item | undefined> {
    const cached = this.cachedItems.find((item) => item.id === id);
    if (cached) return of(cached);

    const foundItem = this.allItems.find((item) => item.id === id);
    return of(foundItem).pipe(delay(100)); // simulate quick fetch
  }
}
