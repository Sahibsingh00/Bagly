import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ServicesService } from '../core/service/services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  durationInSeconds = 3;
  public products : any;
  public cartItems : any = [];
  public getCartTotal : any;
  public cartTotalItems: any;
  public shippingMethods : any = [];
  public noCartItem : boolean = false;
  public isLoading : boolean = false;
  public productList : any ;
  constructor(
    private productService : ServicesService,
    private toastr: ToastrService
  ) { }



  extractSlug(permalink: string): string {
    const parts = permalink.split('/');
    return parts[parts.length - 2]; 
}


  async getcartData(){
    this.isLoading = true;
    let items : any = localStorage.getItem('cart');
    if(items){
      let data = JSON.parse(items);
      if(data && data.items.length > 0){
        this.noCartItem = true;
        this.getCartTotal = data.totals.total_price;
        this.cartItems = data.items
        this.isLoading = false;
      }else{
        this.isLoading = false;
        this.noCartItem = false;
      }
    }else{
      this.isLoading = false;
      this.noCartItem = false;
    }
  }




  removeProductAll(product : any){
    this.isLoading = true;
    this.productService.removeItemFromCart(product).subscribe(response => {
      this.productService.saveCartToStorage(response);
      this.productService.addTocartProduct();
      setTimeout(() => {
        this.getcartData();
      }, 1000);
     });
  }

  removeProduct(product : any, qty : any){
    this.isLoading = true;
    this.productService.decreaseItemQuantity(product, qty).subscribe(response => {
        this.productService.saveCartToStorage(response);
        this.toastr.success('Prodotto rimosso con successo dal carrello!', 'Successo!');
        this.productService.addTocartProduct();
        this.getcartData();
    });
  }



  addProduct(product: any, qty: any) {
    this.isLoading = true;
    this.productService.addSimpleProductToCart(product, 1).subscribe(
      (res: any) => {
        if (res) {
          this.productService.saveCartToStorage(res);
          this.toastr.success('Prodotto aggiunto con successo al carrello!', 'Successo!');
          this.productService.addTocartProduct();
          this.getcartData();
        }
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        if (error.error && error.error.code === 'woocommerce_rest_product_partially_out_of_stock') {
          this.toastr.warning(
            'Non puoi aggiungere questa quantità al carrello perché le scorte di magazzino non sono sufficienti.',
            'Attenzione!'
          );
        } else {
          this.toastr.error('Si è verificato un errore durante l\'aggiunta del prodotto al carrello.', 'Errore!');
        }
      }
    );
  }

  getShippingMethods() {
    this.productService.getShippingMethods().subscribe(
      (data) => {
        this.shippingMethods = data;
      },
    );
  }



  calculateTotal(cartTotals: any, shippingCosts: any): number {
    // Extracting numerical part from the string
    const cartTotal = parseFloat(cartTotals);
    const shippingCost = parseFloat(shippingCosts.replace(/[^\d.-]/g, ''));
  
    if (!isNaN(cartTotal) && !isNaN(shippingCost)) {
      return cartTotal + shippingCost;
    } else {
      return 0; // or handle invalid values as needed
    } 
  }



  async listAllProduct() {
    await this.productService.shopAllProductsWithVariations(12, 1, '', '',).subscribe((res: any) => {
      if (res) {
        this.productList = res;
        for (let i = this.productList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.productList[i], this.productList[j]] = [this.productList[j], this.productList[i]];
        }
      }
    });
  }



  ngOnInit(): void {
    this.getShippingMethods();
    this.getcartData();
    this.listAllProduct();

    this.productService.addTocart.subscribe((name: any) => { 
      this.getcartData();
     });
  }

}
