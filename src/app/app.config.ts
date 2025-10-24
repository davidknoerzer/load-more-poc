import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/**
 * For the scrolling to work we need to use InMemoryScrolling from Angular.
 * We NEED to set scrollPositionRestoration to 'enabled'
 * anchorScrolling default value is 'disabled' but I want to be sure
 */

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'disabled',
      })
    ),
  ],
};
