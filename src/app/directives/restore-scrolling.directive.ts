import { AfterViewInit, Directive, inject } from '@angular/core';
import { AutoScrollService } from '../services/auto-scroll.service';

/**
 * This directive is the trigger for SHOULD SCROLL
 * we put the selector into a HTML Element. When that Element and all its children have loaded successfully AKA "AfterViewInit"
 * then we trigger the shouldScroll in our autoScrollService.
 */

@Directive({
  selector: '[appRestoreScrolling]',
  standalone: true,
})
export class RestoreScrollingDirective implements AfterViewInit {
  private readonly autoScrollService = inject(AutoScrollService);

  ngAfterViewInit(): void {
    this.autoScrollService.shouldScroll.next(true);
  }
}
