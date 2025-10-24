import { CommonModule, Location } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Item, ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-detail',
  imports: [CommonModule],
  templateUrl: './item-detail.component.html',
})
export class ItemDetailComponent {
  item: Signal<Item | undefined>;

  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);

  constructor() {
    const item$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.itemService.getItemById(id);
      })
    );
    this.item = toSignal(item$, { initialValue: undefined });
  }

  goBack(): void {
    this.location.back();
  }
}
