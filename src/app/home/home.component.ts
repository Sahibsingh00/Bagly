import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../core/service/services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public productLimit : number = 8;
  public theme : any = {'description' : '', 'image' : 'assets/images/bannerimg.jpg', 'title' : 'Nuova Collezione'};
  public loading: boolean = true;
  public productList : any = [];
  public models : any = [
    {
        "id": 860,
        "post_title": "Model 8",
        "post_name": "model-8",
        "post_image": "https:\/\/admin.bagly.it\/wp-content\/uploads\/2024\/05\/L8-min.jpg"
    },
    {
        "id": 857,
        "post_title": "Model 7",
        "post_name": "model-7",
        "post_image": "https:\/\/admin.bagly.it\/wp-content\/uploads\/2024\/05\/L7-min.jpg"
    },
    {
      "id": 856,
      "post_title": "Model 6",
      "post_name": "model-6",
      "post_image": "https:\/\/admin.bagly.it\/wp-content\/uploads\/2024\/05\/L6-min.jpg"
  }
]; 
  constructor(
    private productService : ServicesService
  ) { }




  ngOnInit(): void {
    this.getThemeOption();
    this.listAllModels();
    this.listAllProduct();
  }


  async getThemeOption() {
    await this.productService.getThemeOptions().subscribe((res: any) => {
      if (res) {
        this.theme = res;
      }
    });
  }

  async listAllProduct() {
    await this.productService.shopAllProductsWithVariations(8, 1,  '', '').subscribe((res: any) => {
      if (res) {
        this.productList = res;
      }
    });
  }

  async listAllModels(){
    this.productService.loader();
    await this.productService.getModels().subscribe((res : any) =>{
       if(res){
        this.productService.noLoader();
        this.models = res;
       }
    });
  }

}
