import {Routes} from '@angular/router';

import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component'
import {RegisterComponent} from './pages/register/register.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {home_page} from './pages/home-page/home-page.component'
import {cart_page} from './pages/cart-page/cart-page.component'
import {LoginComponent} from './pages/login/login.component';

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
    path: "login",
    component: LoginComponent,
    title: "login page",
  },
  {
    path: "register",
    component: RegisterComponent,
    title: "register page",
  },
  {
    path: "profile",
    component: ProfileComponent,
    title: "profile page",
  },
  {
    path: "**",
    component: PageNotFoundComponent,
    title: "Page Not Found",
  },
];
