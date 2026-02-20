import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { STORED_KEYS } from '../../../core/constant/storedKeys';
import { CartdataResponse } from '../models/cartdata.interface';
import { CartDetailsResponse } from '../models/cart-details.interface';
import { PaymentDetails, PaymentDetailsResponse } from '../models/payment-details.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly httpClient = inject(HttpClient)
  private readonly plat_Id = inject(PLATFORM_ID)
  myHeaders:object= {}

    constructor(){

      if( isPlatformBrowser(this.plat_Id) ){
         this.myHeaders ={
          
            headers:{
              token:localStorage.getItem(STORED_KEYS.userToken)!
            }
        }
      }
    }

  addProductToCart(id:string):Observable<CartdataResponse>{
    return this.httpClient.post<CartdataResponse>(environment.base_url + 'cart' , 
    {
        productId: id,
    },
    this.myHeaders

    )

  }

  getLoggedUserCart():Observable<CartDetailsResponse>{
    return this.httpClient.get<CartDetailsResponse>(environment.base_url + 'cart' , this.myHeaders)
    .pipe(
      // Handle 401 errors and redirect to login
      catchError((error: any) => {
        if (error.status === 401) {
          // Token expired or invalid - clear storage and redirect to login
          if (isPlatformBrowser(this.plat_Id)) {
            localStorage.removeItem(STORED_KEYS.userToken);
            window.location.href = '/login';
          }
        }
        throw error;
      })
    );
  }

  RemoveProductFromCart(id:string):Observable<CartDetailsResponse>{
    return this.httpClient.delete<CartDetailsResponse>(environment.base_url + `cart/${id}` , this.myHeaders)
  }


  updateCartProductQuantity(id:string , count:number):Observable<CartDetailsResponse>{
    return this.httpClient.put<CartDetailsResponse>(environment.base_url + `cart/${id}` ,
       { count:count} ,
       this.myHeaders)
  }


  createCashOrder(cartId: string, paymentData: any): Observable<any> {
    return this.httpClient.post(`${environment.base_url}orders/${cartId}`, paymentData, this.myHeaders);
  }

  chcekOutSession(cartId:string | null, shippingAddress:object):Observable<PaymentDetailsResponse>{
    return this.httpClient.post<PaymentDetailsResponse>(environment.base_url + `orders/checkout-session/${cartId }?url=http://localhost:4200` ,
    shippingAddress ,
       this.myHeaders)
  }





  
}
