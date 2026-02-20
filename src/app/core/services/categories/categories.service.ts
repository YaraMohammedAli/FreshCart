import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { categoriesResponse, Categories } from '../../models/categories/categories.interface';
import { ProductResponse } from '../../models/products/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {

  private readonly httpClient = inject(HttpClient)
  
  getAllCategories():Observable<categoriesResponse> 
  {
    return this.httpClient.get<categoriesResponse>(environment.base_url +'categories')
  }

  getCategoryDetails(categoryId: string):Observable<any> 
  {
    return this.httpClient.get<any>(environment.base_url +'categories/' + categoryId)
  }

  getCategoryProducts(categoryId: string):Observable<ProductResponse> 
  {
    return this.httpClient.get<ProductResponse>(environment.base_url +'products?category[in][]=' + categoryId)
  }
}
