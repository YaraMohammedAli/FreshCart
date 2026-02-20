import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly fb = inject(FormBuilder)
  private readonly cartService = inject(CartService)
  private readonly router = inject(Router)

  cartId:string | null = null
  cartDetails: any = null
  isProcessingPayment: boolean = false

  ngOnInit(): void {
    this.checkoutFormIntilazation()
      this.getCartId()
      this.loadCartDetails()
      // Check if returning from Stripe payment success
      this.checkStripePaymentStatus()
  }



  checkoutForm!: FormGroup

  checkoutFormIntilazation():void{
    this.checkoutForm = this.fb.group({
      shippingAddress:this.fb.group({
        details:[null , Validators.required],
        phone:[null ,[Validators.required,Validators.pattern(/^(\+20|0)?1[0125][0-9]{8}$/)]],
        city:[null ,Validators.required]
      })
  
    })
  }


  getCartId():void{
    this.activatedRoute.paramMap.subscribe({
      next:(urlParams)=>{
        this.cartId= urlParams.get('id');
      },
      error:(err)=>{
        console.log(err);
    }

      
    }
  )

  }

  loadCartDetails(): void {
    if (this.cartId) {
      this.cartService.getLoggedUserCart().subscribe({
        next: (response) => {
          this.cartDetails = response.data;
        },
        error: (err) => {
          console.error('Error loading cart details:', err);
          // If 401 error, redirect to login
          if (err.status === 401) {
            console.log('User not authenticated, redirecting to login...');
            this.router.navigate(['/login']);
          } else {
            this.cartDetails = null;
          }
        }
      });
    }
  }

  checkStripePaymentStatus(): void {
    // Check URL parameters for Stripe payment success
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['payment'] === 'success' || params['status'] === 'success' || params['session_id']) {
        // Redirect to orders page after successful Stripe payment
        this.router.navigate(['/allorders']);
      }
    });
  }

  onSubmitCheckoutForm():void{
    if(this.checkoutForm.valid && !this.isProcessingPayment){
      this.isProcessingPayment = true;
      
      this.cartService.chcekOutSession(this.cartId, this.checkoutForm.value).subscribe({
        next:(res)=>{
          this.isProcessingPayment = false;
          
          if(res.status === 'success' && res.session.url){
            // Redirect to Stripe checkout session
            window.location.href = res.session.url;
          } else {
            console.error('Invalid Stripe session response:', res);
          }
        },
        error:(err)=>{
          this.isProcessingPayment = false;
          console.error('Error creating Stripe session:', err);
        }
      })
    }
  }

}
