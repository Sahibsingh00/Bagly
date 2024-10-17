import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IPayPalConfig,
  ICreateOrderRequest,
  IQueryParam
} from 'ngx-paypal';
import { ServicesService } from '../core/service/services.service';
import { environment } from '../../environments/environment';
import { CheckoutItemscod, CheckoutItemspaypal, CheckoutItemsScalapay, UpdateCustomers, updateOrder } from '../models/checkout-items-model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  public loading = true;
  public durationInSeconds = 3;
  public billingForm!: FormGroup;
  public products: any;
  public cartItems: any;
  public getCartTotal: any;
  public cartTotalItems: any;
  public submitted = false;
  public gatways: any;
  public checkoutItems: any;
  public updateItems: any
  public payPalConfig?: IPayPalConfig;
  public userInfo: any;
  public clientid: string;
  public stateInfo: any;
  public countryInfo: any;
  public cityInfo: any;
  public orderDetails: any;
  public createAccount: boolean = false;
  public shippingMethods: any = [];
  public  italyIndex : any;
  public btnloading : boolean = false;
  public AlreadyCutomer : boolean = false;
  public widgetHTML: SafeHtml = '';
  constructor(
    private formBuilder: FormBuilder,
    private productservice: ServicesService,
    private route: Router,
    private toastr: ToastrService, 
    private http: HttpClient
  ) {
    this.clientid = environment.clientID;
  }



  private initConfig(): void {
    let itemsdata: any;
    itemsdata = this.cartItems.map((item: any) => {
      return {
        ...itemsdata,
        name: item.name,
        quantity: item.quantity,
        category: 'DIGITAL_GOODS',
        unit_amount: {
          currency_code: 'EUR',
          value: item.totals.line_total.toString()
        }
      };
      
    });


    const disableFundingParam: IQueryParam = {
      name: 'disable-funding',
      value: 'mybank'
    };


    this.payPalConfig = {
      currency: 'EUR',
      clientId: this.clientid,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: this.getCartTotal.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.getCartTotal.toString()
              }
            }
          },

          items: itemsdata
        }]
      },
      advanced: {
        commit: 'true',
        extraQueryParams: [disableFundingParam]
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      


      onApprove: (data, actions) => {
        return actions.order.capture().then((details: any) => {
          this.updateOderstatus(details, true);
        }).catch((error : any) => { 
          console.error(error);
        });
      },



      onClientAuthorization: (data) => {
        
      },
      onCancel: (data, actions) => {

          // this.updateOderstatus(data, false);
      },
      onError: err => {
        this.updateOderstatus(err, false);

      },
      onClick: (data, actions) => {
        if (this.billingForm.valid) {
          this.onSubmit();
        }
      }
    };
  }



  /**
* Get user info if loggin
*/
  getUserInfo() {
    let userData = localStorage.getItem('user');
    if (userData) {
      this.userInfo = JSON.parse(userData);

    }
  }

/** get state list */
 async onChangeCountry() {
  this.stateInfo = this.countryInfo.filter((t: any) => t.code === this.f['country'].value);
  this.stateInfo = this.stateInfo[0]?.states;
}



async getListCountry() {
  this.productservice.getCountries().subscribe((res: any) => {
    this.countryInfo = res.filter((country: any) => country.states && country.states.length > 0);
    this.stateInfo = this.countryInfo.filter((t: any) => t.code === 'IT');
    this.stateInfo = this.stateInfo[0]?.states;
  });
}


  createCutomer() {
    if (!this.createAccount) {
      this.createAccount = true;
      this.billingForm.controls["password"].setValidators(Validators.required);
    } else {
      this.createAccount = false;
      this.billingForm.controls['password'].clearValidators()
      this.billingForm.controls['password'].updateValueAndValidity()
    }
 
  }

  get f() { return this.billingForm.controls; }

  createContactForm() {
    this.billingForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address_1: ['', Validators.required],
      city: ['', Validators.required],
      country: ['IT', Validators.required],
      state: ['AG', Validators.required],
      postcode: ['', Validators.required],
      password: [''],
      customer_note : [''],
      termcondition : [false, Validators.requiredTrue],
      paymentMethod : ['pagamento_consegna', Validators.required]
      
    });

  }


  ifAlreadyCustomer(email : any){
    this.productservice.checkCustomer(email).subscribe((res: any) => {
        if(res && res.length > 0){
          this.AlreadyCutomer = true;
        }else{
          this.AlreadyCutomer = false;
        }
    });
  }

  onEmailBlur(){
    if(!this.userInfo){
    if(this.f['email'].value){
      this.ifAlreadyCustomer(this.f['email'].value);
    }
  }
  }

 

 

  onSubmit() {
    this.submitted = true;
    this.btnloading = true;
    if (this.billingForm.invalid) {
      this.btnloading = false;
      return;
    }
    if (this.f['password'].value) {
      this.createNewCutomer();
    } else {
      if (this.userInfo) {
        this.onUpdate();
      }else{
        this.createOrder(this.f['paymentMethod'].value);
      }
    }
  }

  /** Update customers */
  onUpdate() {
    let customer: any = new UpdateCustomers();
    customer.shipping.first_name = this.f['first_name'].value;
    customer.shipping.last_name = this.f['last_name'].value;
    customer.shipping.phone = this.f['phone'].value;
    customer.shipping.address_1 = this.f['address_1'].value;
    customer.shipping.city = this.f['city'].value;
    customer.shipping.country = this.f['country'].value;
    customer.shipping.state = this.f['state'].value;
    customer.shipping.postcode = this.f['postcode'].value;
    this.productservice.UpdateCustomer(this.userInfo.id, customer).subscribe((res: any) => {
      if(res){
        this.createOrder(this.f['paymentMethod'].value);
      }else{
        this.btnloading = false;
      }
    });

  }

  createNewCutomer() {
    let customer: any = {
      first_name: this.f['first_name'].value,
      last_name: this.f['last_name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      billing: {
        first_name: this.f['first_name'].value,
        last_name: this.f['last_name'].value,
        email: this.f['email'].value,
        address_1: this.f['address_1'].value,
        city: this.f['city'].value,
        state: this.f['state'].value,
        postcode: this.f['postcode'].value,
        country: this.f['country'].value,
        phone: this.f['phone'].value
      }
    };

    this.productservice.CreateCustomer(customer)
      .subscribe(
        (response) => {
          this.toastr.success('utente registrato con successo!', '');
          localStorage.setItem('user', JSON.stringify(response));
          this.getUserInfo();
          this.createOrder(this.f['paymentMethod'].value);
        },
        (error) => {
          this.btnloading = false;
          if (error.error.code === 'registration-error-email-exists') {
            this.toastr.warning('utente già registrato!', '');
          } else {
            this.toastr.warning('utente già registrato!', '');
          }
        }
      );

  }


  async getCustomer() {
    await this.productservice.getCustomer(this.userInfo.id).subscribe((res: any) => {
      if (res) {
        if (res.billing.country) {
          this.stateInfo = this.countryInfo.filter((t: any) => t.CountryName === res.billing.country);
          this.stateInfo = this.stateInfo[0]?.States;
        }
        this.billingForm.patchValue({
          first_name: res.billing.first_name,
          last_name: res.billing.last_name,
          email: res.billing.email,
          phone: res.billing.phone,
          address_1: res.billing.address_1,
          city: res.billing.city,
          country: res.billing.country,
          state: res.billing.state,
          postcode: res.billing.postcode,
        });
      }
    });
  }


  async createOrder(type: string) {
    if (type == 'pagamento_consegna') {
    this.productservice.loader();
      this.checkoutItems = new CheckoutItemscod();
      this.checkoutItems.billing = this.billingForm.value;
      this.checkoutItems.shipping = this.billingForm.value;
      this.deletUnwantedVal();
      if (this.userInfo) {
        this.checkoutItems.customer_id = this.userInfo.id;
      }
      
      if(this.f['customer_note'].value){
        this.checkoutItems.customer_note = this.f['customer_note'].value;
      }

      this.cartItems.forEach((value: any) => {
        this.checkoutItems.line_items.push({ 'product_id': value.id, 'quantity': value.quantity });
      });

      if (this.shippingMethods.length > 0) {
        this.checkoutItems.shipping_methods = ['flat_rate'];
        this.checkoutItems.shipping_lines = [
          {
            'method_id': 'flat_rate',
            'method_title': this.shippingMethods[0].title,
            'total': this.shippingMethods[0].cost
          }
        ];
      }
      await this.productservice.createOrder(this.checkoutItems).subscribe((res: any) => {
        if(res){
          this.productservice.noLoader();
          this.btnloading = false;
          this.productservice.removeAllCart().subscribe((res : any)=>{
            console.log('Empty Cart')
          });
          this.toastr.success('Ordine inviato con successo', '');
          this.productservice.addTocartProduct();
          this.route.navigate(['/thankyou'], { queryParams: { id: res.id } });
        }else{
          this.btnloading = false;
        }
      });
    } else if (type == 'carta_credito') {
        this.checkoutItems = new CheckoutItemspaypal();
        this.checkoutItems.billing = this.billingForm.value;
        this.checkoutItems.shipping = this.billingForm.value;
        this.deletUnwantedVal();
          if (this.userInfo) {
            this.checkoutItems.customer_id = this.userInfo.id;
          }

          if(this.f['customer_note'].value){
            this.checkoutItems.customer_note = this.f['customer_note'].value;
          }

          this.cartItems.forEach((value: any) => {
            this.checkoutItems.line_items.push({
              'product_id': value.id,
              'quantity': value.quantity
            });
          });

          this.productservice.createOrder(this.checkoutItems).subscribe((res: any) => {
            this.orderDetails = res;
          });
    }else if (type == 'scalapay') {
        interface ScalapayOrderResponse {
          checkoutUrl: string;
        }

        this.checkoutItems = new CheckoutItemsScalapay();
        this.checkoutItems.billing = this.billingForm.value;
        this.checkoutItems.shipping = this.billingForm.value;
        this.deletUnwantedVal();
          if (this.userInfo) {
            this.checkoutItems.customer_id = this.userInfo.id;
          }

          if(this.f['customer_note'].value){
            this.checkoutItems.customer_note = this.f['customer_note'].value;
          }

          this.cartItems.forEach((value: any) => {
            this.checkoutItems.line_items.push({
              'product_id': value.id,
              'quantity': value.quantity
            });
          });
      
        if (this.userInfo) {
          this.checkoutItems.customer_id = this.userInfo.id;
        }
      
        if (this.f['customer_note'].value) {
          this.checkoutItems.customer_note = this.f['customer_note'].value;
        }
      
        this.deletUnwantedVal();
      
        // Prepare Scalapay order data
        const scalapayOrderDetails  = {
          totalAmount: this.getCartTotal.toString(),
          currency: "EUR",
          type: "online",
          product: "pay-in-3",
          frequencyNumber: 1,
          frequencyType: "monthly",
          orderExpiryMilliseconds: 600000,
          consumer: {
            givenNames: this.f['first_name'].value,
            surname: this.f['last_name'].value,
            email: this.f['email'].value,
            phoneNumber: this.f['phone'].value
          },
          merchant: {
            redirectConfirmUrl: "https://bagly.bagly.it/thankyou",
            redirectCancelUrl: "https://bagly.bagly.it"
          }
        };
      
        // Make parallel API calls
        forkJoin({
          wooCommerceOrder: this.productservice.createOrder(this.checkoutItems),
          scalapayOrder: this.productservice.createOrders(scalapayOrderDetails) as Observable<ScalapayOrderResponse>
        }).pipe(
          map(({ wooCommerceOrder, scalapayOrder }) => {
            if (!scalapayOrder || typeof scalapayOrder.checkoutUrl !== 'string') {
              throw new Error('Invalid Scalapay order response');
            }
            return {
              wooCommerceOrder,
              scalapayCheckoutUrl: scalapayOrder.checkoutUrl
            };
          })
        ).subscribe(
          result => {
            localStorage.setItem('lastOrderId', result.wooCommerceOrder.id.toString());
            window.location.href = result.scalapayCheckoutUrl;
          },
          error => {
            console.error('Error creating orders:', error);
          }
        );
    }
  }


  /**
   * Update order
   * @param data 
   */
  async updateOderstatus(data: any, payment: boolean) {
    this.checkoutItems = new CheckoutItemspaypal();
    this.productservice.loader();
    if (!payment) {
      this.checkoutItems.status = 'failed';
    } else {
      this.checkoutItems.status = 'processing';
    }

    await this.productservice.updateOrder(this.orderDetails.id, this.checkoutItems).subscribe((res: any) => {
      this.productservice.removeAllCart().subscribe((res : any)=>{
        console.log('Empty Cart')
      });
      this.productservice.addTocartProduct();
      if (payment) {
        this.productservice.noLoader();
        this.toastr.success('Ordine inviato con successo!', '');
        this.route.navigate(['/thankyou'], { queryParams: { id: this.orderDetails.id } });
      } else {
        this.productservice.noLoader();
        this.toastr.warning('Pagamento fallito', '');
        this.route.navigate(['/']);
      }
    });
  }



  ngOnInit(): void {
    this.getcartTotal();
    this.getListCountry();
    this.getUserInfo();
    this.createContactForm();
    if (this.userInfo) {
      this.getCustomer();
    }
    if(this.cartItems){
      this.initConfig();
    }
    this.getShippingMethods();
  }




  async getcartTotal() {
    let items: any = localStorage.getItem('cart');
    this.loading = true;
    if (items) {
      let data = JSON.parse(items);
      if (data && data.items.length > 0) {
        this.getCartTotal = parseFloat(data.totals.total_price).toFixed(2);
        this.cartItems = data.items;
        this.loading = false;
      } else {
        this.route.navigate(['/']);
        this.loading = false;
      }
    }else{
      this.route.navigate(['/']);
    }
  }
 


  getShippingMethods() {
    this.productservice.getShippingMethods().subscribe(
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


  deletUnwantedVal(){
    delete this.checkoutItems.billing.termcondition;
    delete this.checkoutItems.billing.order_comments;
    delete this.checkoutItems.billing.paymentMethod;
    delete this.checkoutItems.billing.customer_note;
    delete this.checkoutItems.shipping.termcondition;
    delete this.checkoutItems.shipping.order_comments;
    delete this.checkoutItems.billing.paymentMethod;
    delete this.checkoutItems.billing.customer_note;
  }

}









