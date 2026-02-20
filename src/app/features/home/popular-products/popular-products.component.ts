import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ProductsService } from '../../../core/services/products/products.service';
import { product } from '../../../core/models/products/product.interface';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent],
  templateUrl: './popular-products.component.html',
  styleUrl: './popular-products.component.css',
})
export class PopularProductsComponent implements OnInit  {
  private readonly productsService = inject(ProductsService);

  productList:WritableSignal<product[]> = signal<product[]>([])

  ngOnInit(): void {
      this.productsService.getAllProducts().subscribe({
        next: (res)=>{
          this.productList.set(res.data)
          
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
  }

}
