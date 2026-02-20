import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Categories } from '../../core/models/categories/categories.interface';
import { product } from '../../core/models/products/product.interface';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, RouterLink, CardComponent],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly activatedRoute = inject(ActivatedRoute);

  categoryDetails: WritableSignal<Categories | null> = signal<Categories | null>(null);
  categoryProducts: WritableSignal<product[]> = signal<product[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      if (categoryId) {
        this.loadCategoryData(categoryId);
      }
    });
  }

  loadCategoryData(categoryId: string): void {
    this.isLoading.set(true);
    
    // Load category details
    this.categoriesService.getCategoryDetails(categoryId).subscribe({
      next: (res: any) => {
        this.categoryDetails.set(res.data);
      },
      error: (err) => {
        console.log('Error loading category details:', err);
      }
    });

    // Load category products
    this.categoriesService.getCategoryProducts(categoryId).subscribe({
      next: (res: any) => {
        this.categoryProducts.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Error loading category products:', err);
        this.isLoading.set(false);
      }
    });
  }
}
