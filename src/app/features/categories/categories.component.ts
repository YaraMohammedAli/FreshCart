import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Categories } from '../../core/models/categories/categories.interface';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categoriesList: WritableSignal<Categories[]> = signal<Categories[]>([]);

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
