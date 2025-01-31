import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutData {
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/sales-orders`;
  private items: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);
  private isCartOpenSubject = new BehaviorSubject<boolean>(false);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();
  isCartOpen$ = this.isCartOpenSubject.asObservable();

  constructor(private http: HttpClient) {}

  addToCart(product: any) {
    const existingItem = this.items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }

    this.cartItemsSubject.next(this.items);
    this.cartCountSubject.next(this.getTotalItems());
  }

  private getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  removeFromCart(productId: number) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity -= 1;
      } else {
        this.items.splice(index, 1);
      }
      this.cartItemsSubject.next(this.items);
      this.cartCountSubject.next(this.getTotalItems());
    }
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart() {
    this.items = [];
    this.cartItemsSubject.next(this.items);
    this.cartCountSubject.next(0);
  }

  toggleCart(): void {
    this.isCartOpenSubject.next(!this.isCartOpenSubject.value);
  }

  checkout(customerInfo: { name: string; email: string; mobile: string }): Observable<any> {
    const checkoutData: CheckoutData = {
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_mobile: customerInfo.mobile,
      items: this.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    return this.http.post(this.apiUrl, checkoutData);
  }
}
