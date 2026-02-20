import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'category/:slug/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const http = inject(HttpClient);
      try {
        const response: any = await http.get(environment.base_url + 'categories').toPromise();
        const categories = response.data || [];
        
        return categories.map((category: any) => ({
          slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-'),
          id: category._id || category.id
        }));
      } catch (error) {
        console.error('Error fetching categories for prerendering:', error);
        return [];
      }
    }
  },
  {
    path: 'details/:slug/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const http = inject(HttpClient);
      try {
        const response: any = await http.get(environment.base_url + 'products?limit=50').toPromise();
        const products = response.data || [];
        
        return products.map((product: any) => ({
          slug: product.slug || product.title?.toLowerCase().replace(/\s+/g, '-'),
          id: product._id || product.id
        }));
      } catch (error) {
        console.error('Error fetching products for prerendering:', error);
        return [];
      }
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
