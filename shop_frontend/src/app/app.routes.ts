import {Routes} from '@angular/router';

import {home_page} from './pages/home-page/home-page.component'
import {NAME} from "./app.component";

export const routes: Routes = [
  {
    path: "",
    component: home_page,
    title: "home page",
    data: {title: NAME},
  },
];
