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

  constructor() {
    // Generate 100 dummy items
    for (let i = 1; i <= 100; i++) {
      this.allItems.push({
        id: i,
        title: `Research Item #${i}`,
        description: `This is a detailed description for item number ${i}. It outlines the key findings and methodology of this important research.`,
        imageUrl: `https://picsum.photos/seed/${i}/300/200`,
      });
    }
  }

  // Fetches items from the start up to a given limit
  getItems(limit: number): Observable<Item[]> {
    const itemsToReturn = this.allItems.slice(0, limit);
    return of(itemsToReturn).pipe();
  }

  // Fetches a single item by its ID
  getItemById(id: number): Observable<Item | undefined> {
    const foundItem = this.allItems.find((item) => item.id === id);
    return of(foundItem).pipe(delay(100));
  }
}
