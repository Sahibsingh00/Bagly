import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../service/services.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loading: boolean = true
  public submitted = false;
  public durationInSeconds = 3;
  public btnloading = false;
  loginform!: FormGroup;
  public isCheckout: string = 'false';
  constructor(
    private formBuilder: FormBuilder,
    private authService: ServicesService,
    private _snackBar: MatSnackBar,
    private route: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService, 
  ) {


    this.router.queryParams.subscribe(params => {
      this.isCheckout = params['checkout'];
    });

  }




  get f() {
    return this.loginform.controls; 
  }

  createContactForm() {
    this.loginform = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.loading = false;
  }

  // onSubmit() {
  //   this.btnloading = true;
  //   this.submitted = true;
  //   if (this.loginform.invalid) {
  //     this.btnloading = false;
  //     return;
  //   }
  //   this.authService.userLogin(this.loginform.value).subscribe((response: any) => {
  //     if (response) {
  //       this.authService.getCustomer(response.data.id).subscribe((res: any) => {
  //         {
  //           this.btnloading = false;
  //           localStorage.setItem('user', JSON.stringify(res));
  //           this.toastr.success('Accesso consentito');
  //           this.authService.userLoggin();
  //           setTimeout(() => {
  //             if (this.isCheckout == 'true') {
  //               this.route.navigate(['/checkout']);
  //             } else {
  //               this.route.navigate(['/']);
  //             }
  //           }, 1000);
  //         }
  //       });
  //     }else{
  //       this.btnloading = false;
  //     }
  //   });
  // }


  // onSubmit() {
  //   this.btnloading = true;
  //   this.submitted = true;
  //   if (this.loginform.invalid) {
  //     this.btnloading = false;
  //     return;
  //   }
  //   this.authService.userLogin(this.loginform.value).subscribe(
  //     (response: any) => {
  //       if (response && response.data && response.data.id) {
  //         this.authService.getCustomer(response.data.id).subscribe(
  //           (res: any) => {
  //             this.btnloading = false;
  //             localStorage.setItem('user', JSON.stringify(res));
  //             this.toastr.success('Accesso consentito');
  //             this.authService.userLoggin();
  //             setTimeout(() => {
  //               if (this.isCheckout == 'true') {
  //                 this.route.navigate(['/checkout']);
  //               } else {
  //                 this.route.navigate(['/']);
  //               }
  //             }, 1000);
  //           },
  //           (error) => {
  //             this.btnloading = false;
  //             this.toastr.error('Errore nel recupero dei dati utente', 'Errore');
  //           }
  //         );
  //       } else {
  //         this.btnloading = false;
  //         this.toastr.error('Risposta del server non valida', 'Errore');
  //       }
  //     },
  //     (error: any) => {
  //       this.btnloading = false;
  //       if (error.error && error.error.code === 'invalid_email') {
  //         this.toastr.error('Indirizzo email sconosciuto. Ricontrolla o prova ad usare il tuo nome utente.', 'Errore');
  //       } else if (error.error && error.error.message) {
  //         this.toastr.error(error.error.message, 'Errore');
  //       } else {
  //         this.toastr.error('Si è verificato un errore durante l\'accesso', 'Errore');
  //       }
  //     }
  //   );
  // }
  



onSubmit() {
  this.btnloading = true;
  this.submitted = true;

  if (this.loginform.invalid) {
    this.btnloading = false;
    return;
  }

  this.authService.userLogin(this.loginform.value).pipe(
    switchMap((response: any) => {
      if (response && response.data && response.data.id) {
        return forkJoin({
          loginResponse: of(response),
          customerData: this.authService.getCustomer(response.data.id)
        });
      } else {
        throw new Error('Risposta del server non valida');
      }
    }),
    catchError((error) => {
      this.btnloading = false;
      if (error.error && error.error.code === 'invalid_email') {
        this.toastr.error('Indirizzo email sconosciuto. Ricontrolla o prova ad usare il tuo nome utente.', 'Errore');
      } else if (error.error && error.error.message) {
        this.toastr.error(error.error.message, 'Errore');
      } else {
        this.toastr.error('Si è verificato un errore durante l\'accesso', 'Errore');
      }
      return of(null);
    })
  ).subscribe(
    (result: any) => {
      if (result) {
        this.btnloading = false;
        localStorage.setItem('user', JSON.stringify(result.customerData));
        this.toastr.success('Accesso consentito');
        this.authService.userLoggin();
        setTimeout(() => {
          if (this.isCheckout == 'true') {
            this.route.navigate(['/checkout']);
          } else {
            this.route.navigate(['/']);
          }
        }, 1000);
      }
    },
    (error) => {
      this.btnloading = false;
      this.toastr.error('Errore nel recupero dei dati utente', 'Errore');
    }
  );
}


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


}
