import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { OrdersService } from './services/orders.service';
import { Order } from './models/orders.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CurrencyPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  
  orders: WritableSignal<Order[]> = signal<Order[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  error: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.ordersService.getUserOrders().subscribe({
      next: (response) => {
        this.orders.set(response.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error.set('Failed to load orders. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  getOrderStatusClass(isPaid: boolean, isDelivered: boolean): string {
    if (isDelivered) return 'bg-green-100 text-green-800 border-green-200';
    if (isPaid) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }

  getOrderStatusText(isPaid: boolean, isDelivered: boolean): string {
    if (isDelivered) return 'Delivered';
    if (isPaid) return 'Processing';
    return 'Pending';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
