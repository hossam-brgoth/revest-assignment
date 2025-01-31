import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  isOpen = false;
  checkoutInProgress = false;
  showCheckoutForm = false;
  customerInfo = {
    name: '',
    email: '',
    mobile: ''
  };

  constructor(public cartService: CartService) {
    this.cartService.isCartOpen$.subscribe(
      (isOpen: boolean) => this.isOpen = isOpen
    );
  }

  toggleCart(): void {
    this.cartService.toggleCart();
  }

  startCheckout(): void {
    this.showCheckoutForm = true;
  }

  submitCheckout(): void {
    if (!this.customerInfo.name || !this.customerInfo.email || !this.customerInfo.mobile) {
      alert('Please fill in all required fields');
      return;
    }

    this.checkoutInProgress = true;
    this.cartService.checkout(this.customerInfo).subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);
        this.cartService.clearCart();
        this.showCheckoutForm = false;
        this.customerInfo = { name: '', email: '', mobile: '' };
        this.toggleCart();
        alert('Order placed successfully!');
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
      },
      complete: () => {
        this.checkoutInProgress = false;
      }
    });
  }
}
