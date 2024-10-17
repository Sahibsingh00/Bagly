import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServicesService } from '../core/service/services.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  public order : any;
  public loading = true;
  public orderId : any;

  constructor(
    private productservice : ServicesService,
    private route : ActivatedRoute,
    private router : Router
  ) { }


  getorderDetaild(id : any){
    this.productservice.getOrdersDetail(id).subscribe((res : any)=>{
      if(res){
        this.productservice.noLoader();
        this.order = res;
        this.loading = false;
      }
     });
  }

  ngOnInit(): void {
    this.productservice.loader();
    let data =  this.route.snapshot.queryParams;
    if(data && data['id']){
      this.getorderDetaild(data['id']);
    }

    this.route.queryParams.subscribe(params => {
      const orderToken = params['orderToken'];
      const status = params['status'];
      if (orderToken && status === 'SUCCESS') {
        this.orderId = localStorage.getItem('lastOrderId');
        if(this.orderId){
          this.productservice.removeAllCart().subscribe((res : any)=>{
            console.log('Empty Cart')
          });
          this.productservice.addTocartProduct();
          this.getorderDetaild(this.orderId);
          this.checkOrderStatus(orderToken);
        }else{
          this.router.navigate(['/']);
        }
      }
    });
    
  }


  checkOrderStatus(orderToken: string) {
    this.productservice.checkScalapayOrder(orderToken).subscribe(
      (response: any) => {
          this.updateOrderStatus(parseInt(this.orderId));
      },
    );
  }

  async updateOrderStatus(data: any) {
    localStorage.removeItem('lastOrderId');
    let paymentStaus = {'status' : 'processing'};
    await this.productservice.updateOrder(data, paymentStaus).subscribe((res: any) => {
      this.router.navigate(['/']);
    });
  }

}


