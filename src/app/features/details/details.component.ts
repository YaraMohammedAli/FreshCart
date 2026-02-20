import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductDetailsService } from '../products/services/product-details/product-details.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDetails } from '../products/models/product-details/product-details.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { STORED_KEYS } from '../../core/constant/storedKeys';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit{

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productDetailsService = inject(ProductDetailsService)
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)
  private readonly httpClient = inject(HttpClient)

  productId:string|null = null

  productDetails:WritableSignal<ProductDetails>= signal<ProductDetails>({}as ProductDetails)

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe({
       next:(urlParams)=>{
        this.productId = urlParams.get('id')
        
       }
    }),


      this.productDetailsService.getSpecificProduct(this.productId).subscribe(
      {
        next:(res)=>{
          this.productDetails.set(res.data);
          
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
      )
  }

  // Helper method for Math.floor
  floor(value: number): number {
    return Math.floor(value);
  }

  addProductToCart(): void {
    const token = localStorage.getItem(STORED_KEYS.userToken);
    
    console.log('=== DETAILS COMPONENT DEBUG ===');
    console.log('Current productId:', this.productId);
    console.log('Product details:', this.productDetails());
    console.log('Product _id:', this.productDetails()?._id);
    console.log('Product id:', this.productDetails()?.id);
    
    if (!token) {
      this.toastrService.error('Please login to add products to cart', 'Authentication Error');
      return;
    }
    
    // Use _id from productDetails instead of route parameter
    const productIdToAdd = this.productDetails()?._id || this.productId;
    
    if (productIdToAdd) {
      console.log('Calling cart service with productId:', productIdToAdd);
      this.cartService.addProductToCart(productIdToAdd).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toastrService.success(res.message || 'Product added to cart successfully!', 'Success');
          }
        },
        error: (err) => {
          console.log('Error adding to cart:', err);
          this.toastrService.error('Failed to add product to cart', 'Error');
        }
      });
    }
  }

  addItemToCart(productId: string): void {
    const token = localStorage.getItem(STORED_KEYS.userToken);
    
    console.log('=== TOKEN DEBUG ===');
    console.log('Raw token:', token);
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length);
    
    if (!token) {
      this.toastrService.error('Please login to add products to cart', 'Authentication Error');
      return;
    }
    
    // Check if token is valid JWT format
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.toastrService.error('Invalid token format. Please login again.', 'Authentication Error');
        return;
      }
      
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);
      console.log('Token expires at:', new Date(payload.exp * 1000));
      console.log('Current time:', new Date());
      
      if (Date.now() >= payload.exp * 1000) {
        this.toastrService.error('Token expired. Please login again.', 'Authentication Error');
        return;
      }
      
    } catch (error) {
      console.log('Token decode error:', error);
      this.toastrService.error('Invalid token. Please login again.', 'Authentication Error');
      return;
    }
    
    if (productId) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      
      const body = {
        productId: productId,
        quantity: 1
      };
      
      console.log('=== API CALL DEBUG ===');
      console.log('URL:', environment.base_url + 'cart');
      console.log('Headers:', headers);
      console.log('Body:', body);
      
      this.httpClient.post(environment.base_url + 'cart', body, { headers }).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.status === 'success') {
            this.toastrService.success(res.message || 'Product added to cart successfully!', 'Success');
          }
        },
        error: (err) => {
          console.log('=== API ERROR ===');
          console.log('Error status:', err.status);
          console.log('Error message:', err.message);
          console.log('Full error:', err);
          
          if (err.status === 401) {
            this.toastrService.error('Authentication failed. Please login again.', 'Authentication Error');
          } else {
            this.toastrService.error('Failed to add product to cart', 'Error');
          }
        }
      });
    }
  }

}
