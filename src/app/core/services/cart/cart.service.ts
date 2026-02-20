import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { STORED_KEYS } from '../../constant/storedKeys';

export interface CartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  data: {
    _id: string;
    cartOwner: string;
    products: CartItem[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalCartPrice: number;
  };
}

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    brand: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    price: number;
    priceAfterDiscount?: number;
    ratingsAverage: number;
    slug: string;
  };
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly httpClient = inject(HttpClient)
  
  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem(STORED_KEYS.userToken);
    
    if (!token) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  
  addProductToCart(productId: string, quantity: number = 1):Observable<CartResponse> 
  {
    const body = {
      productId: productId,
      quantity: quantity
    };
    
    const headers = this.getAuthHeaders();
    
    return this.httpClient.post<CartResponse>(environment.base_url +'cart', body, {
      headers: headers
    });
  }

  getCart():Observable<CartResponse> 
  {
    return this.httpClient.get<CartResponse>(environment.base_url +'cart', {
      headers: this.getAuthHeaders()
    })
  }

  updateCartQuantity(productId: string, quantity: number):Observable<CartResponse> 
  {
    const body = {
      quantity: quantity
    };
    
    return this.httpClient.put<CartResponse>(environment.base_url +'cart/' + productId, body, {
      headers: this.getAuthHeaders()
    })
  }

  removeFromCart(productId: string):Observable<any> 
  {
    return this.httpClient.delete<any>(environment.base_url +'cart/' + productId, {
      headers: this.getAuthHeaders()
    })
  }

  clearCart():Observable<any> 
  {
    return this.httpClient.delete<any>(environment.base_url +'cart', {
      headers: this.getAuthHeaders()
    })
  }
}
