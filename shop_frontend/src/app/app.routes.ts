import {Routes} from '@angular/router';

import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component'
import {RegisterComponent} from './pages/register/register.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {HomePageComponent} from './pages/home-page/home-page.component'
import {cart_page} from './pages/cart-page/cart-page.component'
import {LoginComponent} from './pages/login/login.component';

import {BackendHealthGuard} from "./services/backend_health_guard";
import {NAME} from "./app.component";
import {MaintenanceComponent} from "./pages/maintenance/maintenance.component";

export const routes: Routes = [
  {
    path: "",
    canActivate: [BackendHealthGuard],
    children: [
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
        data: {title: NAME}
      },
    ],
    component: HomePageComponent,
    title: "home page",
    data: {title: NAME},
  },
  {
    path: "maintenance",
    component: MaintenanceComponent,
    title: "maintenance page",
  },
  {
    path: "**",
    component: PageNotFoundComponent,
    title: "Page Not Found",
  },
];
