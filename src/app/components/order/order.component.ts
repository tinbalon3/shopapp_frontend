import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartItem } from '../../class/cart-item';
import { CartService } from '../../services/cart.service';

import { Order } from '../../models/order.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../enviroments/environment';
import { CouponService } from '../../services/coupon.service';

import { Response } from '../../response/response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  orderForm!: FormGroup
  totalAmount: number = 0;
  cartItems: CartItem[] = [];
  storage: Storage = localStorage;
  couponCode: string = '';
  totalProduct: number = 0;
  isApplyCoupon = false;
  sessionStorage : Storage = sessionStorage
  orderData: Order = {
    id: 0,
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    status: 'pending',
    address: '',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    shipping_address: '',
    coupon_code: '',
    cart_items: []
  }
  constructor(
    private cartService: CartService,
    private tokenService: TokenService,
    private couponService: CouponService,
    private cdr: ChangeDetectorRef,
    private router :Router,
    private toastr1: ToastrService
  ) {

  }
  ngOnInit(): void {
  

    //Lấy đơn hàng đã thêm vào giỏ hàng
    this.listCartDetails()

    this.orderData.user_id = this.tokenService.getUserId();
    this.orderData.cart_items = this.cartItems.map((item) => {
      return {
        product_id: item.id,
        quantity: item.quantity
      };
    })
    
    
    this.cdr.detectChanges();
  }

  listCartDetails() {
    // get a handle to the cart items
    this.handleCartItems()

    /// subscribe to the cart totalPrice
    this.subscribeValue()


  }
  handleCartItems() {
  
    if (this.storage.getItem(`${environment.cartItems}:${ this.orderData.user_id}`) != null) {
      this.cartItems = JSON.parse(this.storage.getItem(environment.cartItems)!);
      this.cartItems = this.cartService.cartItems.map(item => ({
        ...item,
        thumbnail: `${environment.apiBaseUrl}/products/images/${item.thumbnail}`
      }));

    }
    else
    {
      this.cartService.getCartItems().subscribe(
        data => {
         
          this.cartItems = data;
          this.cartItems = this.cartService.cartItems.map(item => ({
            ...item,
            thumbnail: `${environment.apiBaseUrl}/products/images/${item.thumbnail}`
          }));
        }
      )
    }
  }
  subscribeValue() {
    this.cartService.totalPrice.subscribe(
      data => this.totalAmount = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalProduct = data
    )
  }
  increaseProduct(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
    let existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
    if (existingCartItem) {
        existingCartItem.quantity++;
    }
  }
  decreaseProduct(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
    let existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
    if (existingCartItem) {
        existingCartItem.quantity--;
    }
    if (cartItem.quantity == 0) {
      this.spliceItem(cartItem);
    }
  }
  spliceItem(cartItem: CartItem){
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id)
    //if found, remove  the item  from the array  at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
    }
  }
  remove(cartItem: CartItem) {
    this.cartService.remove(cartItem)
    this.spliceItem(cartItem);
    this.storage.setItem(environment.cartItems, JSON.stringify(this.cartItems));
    this.listCartDetails()
    if(this.cartItems.length == 0){
      this.cartService.clearCartItems();
    }
  }
  get phoneNumber() { return this.orderForm.get('phone_number'); }
  get fullName() { return this.orderForm.get('fullname') }
  get email() { return this.orderForm.get('email') }
  get address() { return this.orderForm.get('address') }
  get shipping_address() { return this.orderForm.get('shipping_address') }
  get note() { return this.orderForm.get('note') }
  get shippingMethod() { return this.orderForm.get('shipping_method') }
  get paymentMethod() { return this.orderForm.get('payment_method') }

  goToCheckout() {
   
   if(!this.isApplyCoupon) {
    this.cartService.updateTotalPrice(0);
   }
   this.sessionStorage.setItem("isApplyCoupon",this.isApplyCoupon+'')
    this.router.navigate(['/checkout']);
  }

  applyCoupon() {
    this.isApplyCoupon = true;
    let couponCode = this.couponCode;
    let totalAmount = this.totalAmount;
    this.couponService.applyCoupon(couponCode, totalAmount).subscribe({
      next: (response: Response) => {
        this.totalAmount = response.data;
        this.cartService.updateTotalPrice(this.totalAmount);
      },
      error: (err: any) => {
        const message = err.error.message;
  
        // Hiển thị thông báo thành công hoặc lỗi
        this.toastr1.error(message, 'Xác thực thành công', {
          timeOut: 2000
        });
  
      },
    });
}
}
