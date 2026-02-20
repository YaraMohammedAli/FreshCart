import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Brands } from '../../core/models/brands/brands.interface';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  brandsList: WritableSignal<Brands[]> = signal<Brands[]>([]);

  ngOnInit(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res: any) => {
        this.brandsList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
