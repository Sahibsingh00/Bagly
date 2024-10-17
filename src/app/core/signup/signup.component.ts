import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../service/services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public loading: boolean = true
  public submitted = false;
  public durationInSeconds = 3;
  signupform!: FormGroup;
  public isCheckout: string = 'false';
  public btnloading = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: ServicesService,
    private route: Router,
    private router: ActivatedRoute,
    private toastr : ToastrService
  ) { }

  getUserInfo(){
    let userData : any = localStorage.getItem('user');
    if(userData){
      this.route.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.createContactForm();
  }


  get f() {
    return this.signupform.controls;
  }

  createContactForm() {
    this.signupform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      terms : [false, Validators.requiredTrue],
    });
    this.loading = false;
  }

  onSubmit() {
    this.btnloading = true;
    this.submitted = true;
    if (this.signupform.invalid) {
      this.btnloading = false;
      return;
    }

    
    let customer: any = {
      first_name: this.f['firstName'].value,
      last_name: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      billing: {
        first_name: this.f['firstName'].value,
        last_name: this.f['lastName'].value,
        email: this.f['email'].value,
        address_1: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        phone: ''
      }
    };


    this.authService.CreateCustomer(customer)
    .subscribe(
      (response) => {
        this.toastr.success('utente registrato con successo!', '');
        localStorage.setItem('user', JSON.stringify(response));
        this.authService.userLoggin();
        this.btnloading = false;
        this.route.navigate(['login']);
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

}
