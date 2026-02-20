import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CartService } from './services/cart.service';
import { CartdataResponse } from './models/cartdata.interface';
import { CartDetails} from './models/cart-details.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {

  private readonly cartService = inject(CartService)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)

  cartDetailsData: WritableSignal<CartDetails> = signal<CartDetails>({} as CartDetails)
  isLoading: WritableSignal<boolean> = signal<boolean>(false)
  isUpdating: WritableSignal<boolean> = signal<boolean>(false)
  isProcessingCashPayment: WritableSignal<boolean> = signal<boolean>(false)
  showCashPaymentForm: WritableSignal<boolean> = signal<boolean>(false)

  cashPaymentForm: FormGroup = this.fb.group({
    shippingAddress: this.fb.group({
      details: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(\+20|0)?1[0125][0-9]{8}$/)]],
      city: ['', Validators.required]
    })
  })

  ngOnInit(): void {
    this.getUserCartData()
  }

  getUserCartData(): void {
    this.isLoading.set(true)
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data)
        }
        this.isLoading.set(false)
      },
      error: (err) => {
        console.log('Cart error:', err);
        this.isLoading.set(false)
        
        // Handle 401 error - redirect to login
        if (err.status === 401) {
          console.log('User not authenticated, redirecting to login...');
          this.router.navigate(['/login']);
        }
      }
    })
  }

  RemoveProductFromCart(id: string): void {
    this.isUpdating.set(true)
    this.cartService.RemoveProductFromCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data)
          this.showSuccessMessage('Product removed from cart')
        }
        this.isUpdating.set(false)
      },
      error: (err) => {
        console.log(err);
        this.isUpdating.set(false)
      }
    })
  }

  updateProductCount(id: string, count: number): void {
    if (count < 1) return;
    
    this.isUpdating.set(true)
    this.cartService.updateCartProductQuantity(id, count).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data)
          this.showSuccessMessage('Cart updated successfully')
        }
        this.isUpdating.set(false)
      },
      error: (err) => {
        console.log(err);
        this.isUpdating.set(false)
      }
    })
  }

  processCashPayment(): void {
    if (this.cashPaymentForm.valid && !this.isProcessingCashPayment()) {
      this.isProcessingCashPayment.set(true)
      
      const cartId = this.cartDetailsData()._id
      const paymentData = this.cashPaymentForm.value
      
      this.cartService.createCashOrder(cartId, paymentData).subscribe({
        next: (res: any) => {
          this.isProcessingCashPayment.set(false)
          if (res.status === 'success') {
            this.showSuccessMessage('Order placed successfully!')
            this.router.navigate(['/allorders'])
          }
        },
        error: (err: any) => {
          this.isProcessingCashPayment.set(false)
          console.error('Error creating cash order:', err)
        }
      })
    }
  }

  toggleCashPaymentForm(): void {
    this.showCashPaymentForm.set(!this.showCashPaymentForm())
  }

  showSuccessMessage(message: string): void {
    console.log(message);
  }

  calculateTotal(): number {
    const subtotal = this.cartDetailsData().totalCartPrice || 0;
    const tax = subtotal * 0.2;
    return subtotal + tax;
  }

}
