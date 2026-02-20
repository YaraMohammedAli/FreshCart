import { Component } from '@angular/core';
import { PopularProductsComponent } from "./popular-products/popular-products.component";
import { MainSliderComponent } from "./main-slider/main-slider.component";
import { PopularCategoriesComponent } from "./popular-categories/popular-categories.component";

@Component({
  selector: 'app-home',
  imports: [PopularProductsComponent, MainSliderComponent, PopularCategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent  {

  
}
