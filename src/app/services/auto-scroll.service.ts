import { ViewportScroller } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';

/**
 * Service to manage and restore scroll position upon navigation.
 *
 * This service listens for router 'Scroll' events, which fire after navigation.
 * It conditionally restores the scroll position based on the `shouldScroll` BehaviorSubject.
 *
 * By default, scrolling is disabled. To enable scroll restoration for a navigation,
 * set `shouldScroll.next(true)` before the navigation occurs. The service will
 * then capture the scroll position from the `Scroll` event and use `ViewportScroller`
 * to restore it. After the scroll, `shouldScroll` should ideally be reset to `false`
 * to prevent unwanted scrolling on subsequent navigations.
 */

@Injectable({ providedIn: 'root' })
export class AutoScrollService {
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  shouldScroll = new BehaviorSubject<boolean>(false);
  private shouldScroll$ = this.shouldScroll.asObservable();

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is Scroll => event instanceof Scroll),
        map((event: Scroll) => event.position),
        switchMap((position) => {
          return this.shouldScroll$.pipe(
            filter(Boolean),
            map(() => position)
          );
        })
      )
      .subscribe((position) => {
        // Scroll to the saved position or to the top if no position exists
        this.viewportScroller.scrollToPosition(position || [0, 0]);
        this.shouldScroll.next(false);
      });
  }
}
