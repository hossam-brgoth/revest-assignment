import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cross-sell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cross-sell.component.html'
})
export class CrossSellComponent implements OnInit {
  products: any[] = [];
  showNotification = false;
  notificationMessage = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        this.products = data.slice(0, 4); // Get first 4 products
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.notificationMessage = `${product.name} added to cart`;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}
