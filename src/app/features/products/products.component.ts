import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../core/services/products/products.service';
import { product } from '../../core/models/products/product.interface';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule,NgxPaginationModule,SearchPipe ,FormsModule,CardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productList: WritableSignal<product[]> = signal<product[]>([]);

  pagination:PaginationInstance = { 
    id: 'products',
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0 };




  ngOnInit(): void {
    this.getAllProductsData()
  }

  text:string = ''
 


  getAllProductsData():void{
    this.productsService.getAllProducts(this.pagination.currentPage , this.pagination.itemsPerPage).subscribe({
      next: (res: any) => {
        this.productList.set(res.data);
        this.pagination.totalItems= res.results;
      },
      error: (err) => {
        console.log(err);
      }
    });

  }
  pageChanged(page:number):void{

    this.pagination.currentPage = page;

    this.getAllProductsData()


  }
}
