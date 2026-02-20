import { Component, inject, Input } from '@angular/core';
import { product } from '../../../core/models/products/product.interface';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() cardProduct: product = {} as product;

  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)

  addItemToCart(productId: string): void {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      this.toastrService.error('Please login to add products to cart', 'Authentication Error');
      return;
    }
    
    this.cartService.addProductToCart(productId).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message || 'Product added to cart successfully!', 'Success');
        }
      },
      error: (err: any) => {
        console.log('Error adding to cart:', err);
        this.toastrService.error('Failed to add product to cart', 'Error');
      }
    });
  }

  // Helper method for discount percentage calculation
  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    return Math.round((1 - discountedPrice / originalPrice) * 100);
  }

}
