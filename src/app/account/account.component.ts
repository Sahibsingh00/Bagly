import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ServicesService } from '../core/service/services.service';
import { UpdateCustomers } from '../models/checkout-items-model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public submitted = false;
  public durationInSeconds = 3;
  signupform!: FormGroup;  
  billingForm!:  FormGroup;   
  
  public stateInfo: any;
  public countryInfo: any;
  public cityInfo: any;

  public userInfo : any;
  public orders : any;
  constructor(
   private productservice : ServicesService,
   private router : Router,
   private formBuilder: FormBuilder,
   private _snackBar: MatSnackBar,
   private route : Router
  ) { }



  ngOnInit(): void {
    this.getUserInfo();
    this.getCountries();
    this.createContactForm();
    this.createBillingForm();
    this.getOrderList();
    this.getCustomer();  
  }

  openSnackBar(data: string) {
    this._snackBar.open(data, 'Close', {
      duration: this.durationInSeconds * 1000,
    });
  }

  get f() {
    return this.signupform.controls;
  }

  get g() {
    return this.billingForm.controls;
  }

  createContactForm() {
    this.signupform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  createBillingForm(){
    this.billingForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],  
      email: ['', [Validators.required, Validators.email]], 
      phone: ['', Validators.required],  
      address_1: ['', Validators.required],  
      city: ['', Validators.required],    
      country: ['', Validators.required],  
      state: ['', Validators.required], 
      postcode: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.signupform.invalid) {
      return;
    }
    this.productservice.userSignUp(this.signupform.value).subscribe((res: any) => {
      if (res) {
        this.openSnackBar(res.message);
        if (res.code == 200) {
          setTimeout(() => {
              this.router.navigate(['/login']);
          }, 1000);
        }
      }
    });
  }



  logout(){
    localStorage.removeItem('user');
    // this.isCart = false;
    // this.itemCount = 0;
    setInterval(() => {
      this.router.navigate(['/']);
    }, 500);
  }


    /**
   * Get user info if loggin
   */
     getUserInfo(){
      let userData = localStorage.getItem('user');
      if(userData){
        this.userInfo = JSON.parse(userData);
      }else{
        this.route.navigate(['/']);
        this.userInfo = {};
      }
    }

    async getCustomer(){
      await this.productservice.getCustomer(this.userInfo.id).subscribe((res : any)=>{
        if(res){
          if(res.shipping.country){
            this.stateInfo  = this.countryInfo.filter((t: any ) =>t.CountryName === res.shipping.country);
            this.stateInfo = this.stateInfo[0]?.States;
          }
          this.signupform.patchValue({
            email: res.email,
            username: res.username,
            firstName: res.first_name,
            lastName: res.last_name
          });

          this.billingForm.patchValue({
            first_name: res.shipping.first_name,
            last_name: res.shipping.last_name,  
            email: res.email, 
            phone: res.shipping.phone,  
            address_1: res.shipping.address_1,  
            city: res.shipping.city,    
            country: res.shipping.country,  
            state: res.shipping.state, 
            postcode: res.shipping.postcode,
          });
        }
      });
    }


    onUpdate(){
      let customer : any = new UpdateCustomers();
      customer.shipping.first_name = this.billingForm.controls['first_name'].value;
      customer.shipping.last_name = this.billingForm.controls['last_name'].value;
      customer.shipping.phone = this.billingForm.controls['phone'].value;
      customer.shipping.address_1 = this.billingForm.controls['address_1'].value;
      customer.shipping.city = this.billingForm.controls['city'].value;
      customer.shipping.country = this.billingForm.controls['country'].value;
      customer.shipping.state = this.billingForm.controls['state'].value;
      customer.shipping.postcode = this.billingForm.controls['postcode'].value;
      this.productservice.UpdateCustomer(this.userInfo.id, customer).subscribe((res : any)=>{
        
      });
      
    }

      /** get country list */
  getCountries() {
    this.productservice.allCountries().
      subscribe((res: any) => {
        this.countryInfo = res.Countries;
      });

     
  }

  /** get state list */
  onChangeCountry() {
    this.stateInfo  = this.countryInfo.filter((t: any ) =>t.CountryName === this.g['country'].value);
    this.stateInfo = this.stateInfo[0]?.States;
  }


    /**
     * list users order
     */

   async getOrderList(){
      await this.productservice.getUsersOrder(this.userInfo.id).subscribe((res : any)=>{
        if(res){
          this.orders = res;
        }
      });
    }
}
