import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { OrdersService } from '../orders/services/orders.service';
import { Order } from '../orders/models/orders.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-allorders',
  imports: [CurrencyPipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllordersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  
  orders: WritableSignal<Order[]> = signal<Order[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  error: WritableSignal<string | null> = signal<string | null>(null);
  latestOrder: WritableSignal<Order | null> = signal<Order | null>(null);

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.ordersService.getUserOrders().subscribe({
      next: (response) => {
        const orders = response.data || [];
        // Sort orders by date (newest first) and get the latest order
        const sortedOrders = orders.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        this.orders.set(sortedOrders);
        
        // Set the latest order as the featured order
        if (sortedOrders.length > 0) {
          this.latestOrder.set(sortedOrders[0]);
        }
        
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

  isLatestOrder(order: Order): boolean {
    return this.latestOrder()?._id === order._id;
  }
}
