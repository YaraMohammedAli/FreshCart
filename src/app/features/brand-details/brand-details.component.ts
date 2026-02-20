import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Brands } from '../../core/models/brands/brands.interface';
import { product } from '../../core/models/products/product.interface';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-brand-details',
  imports: [CommonModule, RouterLink, CardComponent],
  templateUrl: './brand-details.component.html',
  styleUrl: './brand-details.component.css',
})
export class BrandDetailsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly activatedRoute = inject(ActivatedRoute);

  brandDetails: WritableSignal<Brands | null> = signal<Brands | null>(null);
  brandProducts: WritableSignal<product[]> = signal<product[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const brandId = params.get('id');
      if (brandId) {
        this.loadBrandData(brandId);
      }
    });
  }

  loadBrandData(brandId: string): void {
    this.isLoading.set(true);
    
    // Load brand details
    this.brandsService.getBrandDetails(brandId).subscribe({
      next: (res: any) => {
        this.brandDetails.set(res.data);
      },
      error: (err) => {
        console.log('Error loading brand details:', err);
      }
    });

    // Load brand products
    this.brandsService.getBrandProducts(brandId).subscribe({
      next: (res: any) => {
        this.brandProducts.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Error loading brand products:', err);
        this.isLoading.set(false);
      }
    });
  }
}
