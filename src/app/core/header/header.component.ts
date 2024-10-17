import { Component, ElementRef, EventEmitter, HostListener, Inject, OnInit, Output, Renderer2 } from '@angular/core';
import { trigger, state, transition, query, style, animate, group } from '@angular/animations';
import { RouterModule, Routes, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ServicesService } from '../service/services.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent implements OnInit {
  // @Output() clickedOutside = new EventEmitter<void>();
  public loading : boolean = true;
  public counter: number = 0;
  public list : any = [];
  public itemCount : number = 0;
  public userInfo : any;
  public searchBox : boolean = false;
  public searchText : string = '';
  public searchProductList : any;

  public durationInSeconds = 3;
  public cartItems : any;
  public getCartTotal : any;
  public products : any;
  public isCart : boolean = false; 
  public status: boolean = false;


  // id$ : Observable<string>;
  constructor(
    private productservice: ServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document
  ) { 
  }



  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.hidesearchBox();
    }
  }




  openMenuNav(){
    this.status = !this.status;  
    if (this.status) {
      this.renderer.addClass(this.document.body, 'mobilemenu-open');
    } else {
      this.renderer.removeClass(this.document.body, 'mobilemenu-open');
    }
  }

  removeProduct(product : any, $event:any){
    $event.preventDefault();
    this.productservice.removeItemFromCart(product).subscribe((response : any ) => {
      this.toastr.success('Prodotto rimosso con successo dal carrello!', ''); 
      this.productservice.saveCartToStorage(response);
      this.productservice.addTocartProduct();
      setTimeout(() => {
        this.getcartData();
      }, 500);
     });
  }

  refresspage() {
    this.productservice.refressProduct();
  }

  extractSlug(permalink: string): string {
    const parts = permalink.split('/');
    return parts[parts.length - 2]; 
}


  async getcartData(){
    let items : any = localStorage.getItem('cart');
    this.loading = true; 
    if(items){
      let data = JSON.parse(items);
      if(data && data.items.length > 0){
        this.itemCount = data.items_count;
        this.getCartTotal = data.totals.total_price;
        this.cartItems = data.items
        this.isCart = true;
        this.loading = false; 
      }else{
        this.itemCount = 0;
      }
    }else{
      this.itemCount = 0;
    }
  }


  /**
   * Get user info if loggin
   */
  getUserInfo(){
    let userData = localStorage.getItem('user');
    if(userData){
      this.userInfo = JSON.parse(userData);
    }else{
      this.userInfo = {};
    }
  }


  /** logout user */
  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.clear();
    this.getUserInfo();
    this.isCart = false;
    this.itemCount = 0;
    // setInterval(() => {
      this.router.navigate(['/']);
    // }, 1000);
    

  }

  
  ngOnInit(): void {

    this.getUserInfo();
    this.productservice.addTocart.subscribe((name: any) => { 
      this.getcartData();
     });

     this.productservice.isLoggin.subscribe((name: any) => { 
       this.getUserInfo();
     }); 


     this.getcartData();
  }


  refressCategory(){
    this.productservice.refressCategory();
  }



  openSearchBox($event : any){
    $event.preventDefault();
    this.searchBox = true;
  }

  hidesearchBox(){
    this.searchBox = false;
    this.searchProductList = [];
    this.searchText = '';
  }
 
  searchProducts(){
   if(this.searchText.length >= 3){
     this.productservice.getAllSearchProducts(this.searchText).subscribe((res : any)=>{
       if(res){
         this.searchProductList = res;
       }else{
        this.searchProductList = [];
       }
     });
   }else{
    this.searchProductList = [];
   }
 }

 getCharacterCount(): number {
  return this.searchText ? this.searchText.length : 0;
}

 productLink(item : any){
  this.searchBox = false;
  this.searchText = '';
  this.searchProductList = [];
  this.router.navigate(['/product/' + item.slug]);
 }


}
