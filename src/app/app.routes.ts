import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // ─── Guest Routes (not logged in) ────────────────────────────────────────────
  // Wrapped in AuthLayoutComponent (e.g. centered card layout)
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    canActivate: [guestGuard],
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./core/auth/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        title: 'Register',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./core/auth/login/login.component').then(
            (c) => c.LoginComponent
          ),
        title: 'Login',
      },
    ],
  },

  // ─── Protected Routes (must be logged in) ────────────────────────────────────
  // Wrapped in MainLayoutComponent (e.g. navbar + sidebar layout)
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(
        (c) => c.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(
            (c) => c.HomeComponent
          ),
        title: 'Home',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products.component').then(
            (c) => c.ProductsComponent
          ),
        title: 'Products',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
        title: 'Categories',
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/cart.component').then(
            (c) => c.CartComponent
          ),
        title: 'Cart',
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/brands/brands.component').then(
            (c) => c.BrandsComponent
          ),
        title: 'Brands',
      },
      {
        path: 'category/:slug/:id',
        loadComponent: () =>
          import('./features/category-details/category-details.component').then(
            (c) => c.CategoryDetailsComponent
          ),
        title: 'Category Details',
      },
      {
        path: 'brand/:slug/:id',
        loadComponent: () =>
          import('./features/brand-details/brand-details.component').then(
            (c) => c.BrandDetailsComponent
          ),
        title: 'Brand Details',
      },
      {
        path: 'details/:slug/:id',
        loadComponent: () =>
          import('./features/details/details.component').then(
            (c) => c.DetailsComponent
          ),
        title: 'Details',
      },
      {
        path: 'checkout/:id',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then(
            (c) => c.CheckoutComponent
          ),
        title: 'Checkout',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
        title: 'Orders',
      },
      {
        path: 'allorders',
        loadComponent: () =>
          import('./features/allorders/allorders.component').then(
            (c) => c.AllordersComponent
          ),
        title: 'All Orders',
      },
    ],
  },

  // ─── 404 Fallback ────────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('./features/notfound/notfound.component').then(
        (c) => c.NotfoundComponent
      ),
    title: 'Error!',
  },
];