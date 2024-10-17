import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ServicesService } from '../core/service/services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contact!: FormGroup;
  public submitted = false;
  constructor(
    private fb : FormBuilder,
    private authService : ServicesService,
    private toastr: ToastrService
  ){

  }

  contactForm(){
    this.contact = this.fb.group({
      firstName : ['' ,[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone : ['', [Validators.required]],
      message : ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    });
  }

  get f() {
    return this.contact.controls; 
  }


  onSubmit() {
    this.submitted = true;
    if (this.contact.invalid) {
      return;
    }
    this.authService.contactMe(this.contact.value).subscribe((res: any) => {
      if (res && res == 'Email sent successfully.') {
        this.contact.reset();
        this.submitted = false;
        this.toastr.success('Email Sent!');
      }
    });
  }


  ngOnInit(){
    this.contactForm();
  }


}
