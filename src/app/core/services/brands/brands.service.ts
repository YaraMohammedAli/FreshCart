import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { brandsResponse, Brands } from '../../models/brands/brands.interface';
import { ProductResponse } from '../../models/products/product.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {

  private readonly httpClient = inject(HttpClient)
  
  getAllBrands():Observable<brandsResponse> 
  {
    return this.httpClient.get<brandsResponse>(environment.base_url +'brands')
  }

  getBrandDetails(brandId: string):Observable<any> 
  {
    return this.httpClient.get<any>(environment.base_url +'brands/' + brandId)
  }

  getBrandProducts(brandId: string):Observable<ProductResponse> 
  {
    return this.httpClient.get<ProductResponse>(environment.base_url +'products?brand[in][]=' + brandId)
  }
}
