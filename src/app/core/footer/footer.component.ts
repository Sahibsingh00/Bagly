import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from '../service/services.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  email: string = '';
  @ViewChild('emailInput') emailInput!: NgModel;
  constructor(
    private toastr: ToastrService,
    private authService: ServicesService
  ) { }

  ngOnInit(): void {
  }


  onEnter() {
    if (this.emailInput.valid) {
      let data = {'email' : this.email};
      this.authService.userSubscribe(data).subscribe((res: any)=>{
        if(res && res.id){
          this.email = '';
          this.toastr.success('Grazie per l\'iscrizione! Ti terremo aggiornato.');
        }
      });
      
    } else {
      console.log('Invalid email');
    }
  }

  scrollbarTop(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

}
