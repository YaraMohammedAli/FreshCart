import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { Categories } from '../../../core/models/categories/categories.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-popular-categories',
  imports: [CarouselModule],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css',
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categoriesList:WritableSignal<Categories[]> = signal<Categories[]>([])

  ngOnInit(): void {
      this.categoriesService.getAllCategories().subscribe({
        next: (res)=>{

          this.categoriesList.set(res.data);
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
  }

  categoriesCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay:true,
    autoplayTimeout:1500,
    autoplayHoverPause:true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 2
      },
      740: {
        items: 3
      },
      1100: {
        items: 5
      }
    },
    nav: false
  }


}
