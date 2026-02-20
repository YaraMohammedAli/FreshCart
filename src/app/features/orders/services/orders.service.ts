import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { STORED_KEYS } from '../../../core/constant/storedKeys';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);
  private readonly plat_Id = inject(PLATFORM_ID);

  constructor() {}

  getUserOrders(): Observable<any> {
    // Get user ID from localStorage or use the hardcoded one as fallback
    let userId = '6407cf6f515bdcf347c09f17'; // fallback ID
    
    if (isPlatformBrowser(this.plat_Id)) {
      const userData = localStorage.getItem(STORED_KEYS.userData);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user._id || userId;
        } catch (e) {
          console.log('Error parsing user data, using fallback ID');
        }
      }
    }

    return this.httpClient.get(`${environment.base_url}orders/user/${userId}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.httpClient.get(`${environment.base_url}orders/${orderId}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.httpClient.post(`${environment.base_url}orders`, orderData);
  }
}
