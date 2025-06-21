import {Routes} from '@angular/router';

import {home_page} from './pages/home-page/home-page.component'
import {cart_page} from './pages/cart-page/cart-page.component'
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component'

import {NAME} from "./app.component";

export const routes: Routes = [
  {
    path: "",
    component: home_page,
    title: "home page",
    data: {title: NAME},
  },
  {
    path: "cart",
    component: cart_page,
    title: "cart page",
  },
  {
    path: "**",
    component: PageNotFoundComponent,
    title: "Page Not Found",
  },
];
