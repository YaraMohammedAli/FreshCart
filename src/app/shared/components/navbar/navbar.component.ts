import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/authentication/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input({required:true}) isLogin:boolean = true

  private readonly flowbiteService = inject(FlowbiteService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  
  cartItemsCount: WritableSignal<number> = signal<number>(0);

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    
    // Get cart items count
    this.getCartItemsCount();
  }

  getCartItemsCount(): void {
    // Check if running in browser (not SSR)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('userToken');
      if (token) {
        this.cartService.getCart().subscribe({
          next: (res) => {
            this.cartItemsCount.set(res.numOfCartItems || 0);
          },
          error: (err) => {
            console.log('Error getting cart:', err);
            this.cartItemsCount.set(0);
          }
        });
      }
    }
  }

  signOut():void{
    this.authService.userLogOut()
  }

}
