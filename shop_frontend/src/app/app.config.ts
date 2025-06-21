// import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
// import {provideRouter} from '@angular/router';
//
// import {routes} from './app.routes';
// import {provideClientHydration} from '@angular/platform-browser';
//
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({eventCoalescing: true}),
//     provideRouter(routes),
//     provideClientHydration()],
// };

import {ApplicationConfig} from '@angular/core';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes)
  ]
};
