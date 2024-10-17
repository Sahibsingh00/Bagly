import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../../core/service/services.service';

@Component({
  selector: 'app-home-collection',
  templateUrl: './home-collection.component.html',
  styleUrls: ['./home-collection.component.scss']
})
export class HomeCollectionComponent implements OnInit {
  @Input() models: any;
  showIndicators = false;
  public productCat : any = []; 
  public rotatetxt : string = '';
  public isLoading : boolean = true;
  constructor(
    private productservice : ServicesService,
    private router: Router
  ) { }


  async listAllProduct(){
    await this.productservice.getallCategory().subscribe((res : any) =>{
       if(res){
        this.productCat = res;
        this.productCat.forEach( (item : any, index : any) => {
          if(item.name === 'Uncategorized') this.productCat.splice(index,1);
        });
          this.isLoading = false;
       }
    });
  }

  categoryItem(cat : any){
    this.router.navigate(['/category/' + cat.slug], { queryParams: { id: cat.id }});
  }

  

  ngOnInit(): void {
    this.listAllProduct();
  }

}
