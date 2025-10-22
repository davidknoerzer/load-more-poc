import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Item, ItemService } from '../../services/item';
import { ItemCard } from '../item-card/item-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ItemCard],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  items: Item[] = [];
  currentPage = 1;
  itemsPerPage = 24;
  isLoading = false;
  allItemsLoaded = false;
  totalItems = 100;

  private itemService = inject(ItemService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap((params) => {
          this.currentPage = params.get('page') ? +params.get('page')! : 1;
          const itemsToLoad = this.currentPage * this.itemsPerPage;
          return this.itemService.getItems(itemsToLoad);
        })
      )
      .subscribe((loadedItems) => {
        this.items = loadedItems;
        this.isLoading = false;
        if (this.items.length >= this.totalItems) {
          this.allItemsLoaded = true;
        }
      });
  }

  loadMore(): void {
    if (this.isLoading || this.allItemsLoaded) return;

    this.isLoading = true;
    this.currentPage++;

    // Fetch only the NEXT page of data
    this.itemService
      .getItems(this.currentPage * this.itemsPerPage)
      .subscribe((newItems) => {
        // 1. IMPORTANT: Append new items instead of replacing the whole list
        this.items = [...this.items, ...newItems];
        this.isLoading = false;

        // 2. Use location.go() to update the URL silently without navigation
        const url = this.router.url.split('?')[0];
        this.location.go(url, `page=${this.currentPage}`);

        if (this.items.length >= this.totalItems) {
          this.allItemsLoaded = true;
        }
      });
  }
}
