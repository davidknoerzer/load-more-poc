import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Item } from '../../services/item.service';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-card.component.html',
})
export class ItemCardComponent {
  item = input.required<Item>();
  private readonly router = inject(Router);

  goToDetail(itemId: number) {
    this.router.navigate(['/item', itemId]);
  }
}
