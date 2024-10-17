import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../core/service/services.service';
import { allProducts } from '../../assets/default.products';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent {
  public myImgUrl: string = "assets/images/default-image.jpg";
  public product: any;
  public selectedVariation: any;
  public filterTYpe : any = 'popularity';
  public catName : string = '';
  public colorName : string = '';
  public filterType : string = '';
   public currentSelectedItems: any;
  public products : any[] =  allProducts;
  public selectedImages: { [key: string]: string } = {};
  public activeOptions: { [key: string]: string } = {};
  public page : number = 1;

  public allPaColor : any =[
    {"name": "Arancio","slug": "arancio"},
    {"name": "Beige","slug": "beige"},
    {"name": "Bianco","slug": "bianco"},
    {"name": "Blue", "slug": "blue"},
    {"name": "Bordeaux","slug": "bordeaux"},
    {"name": "Celeste","slug": "celeste" },
    {"name": "Cuoio", "slug": "cuoio" },
    {"name": "Fango", "slug": "fango" },
    {"name": "Fucsia", "slug": "fucsia"},
    {"name": "Giallo","slug": "giallo" }
];
  constructor(
    private productservice: ServicesService,
  ) {


  }


 async loadMore(){
    this.productservice.loader();
    await this.productservice.shopAllProductsWithVariations(12, this.page , this.colorName, this.filterType)
       .subscribe({ next: (data: any) => {
          if(data.length == 0 || data.length < 12){
            this.products = [...this.products, ...data];
            this.page = 0;
          }else{
            this.products = [...this.products, ...data];
            this.page++;
          }
          
         }, error: (error) => {
          this.productservice.noLoader();
         }, complete: () => {
          this.productservice.noLoader();
         }
       });
  }


  async getProductsList() {
    this.productservice.loader();
    await this.productservice.shopAllProductsWithVariations(12, this.page , this.colorName, this.filterType)
       .subscribe({ next: (data: any) => {
        this.products = data;
          if(data.length == 0 || data.length < 12){
            this.products = data;
            this.page = 0;
          }else{
            this.products = data;
            this.page++;
          }

         }, error: (error) => {
          this.productservice.noLoader();
         }, complete: () => {
          this.productservice.noLoader();
         }
       });
   }
 
 
   selectVariations(items: any, option: string) {
     const productId = items.id;
     this.activeOptions[productId] = option;
 
     const selectedVariation = items.variations.find(
       (variation: any) => variation.attributes.attribute_pa_color === option
     );
 
     if (selectedVariation && selectedVariation.variation_gallery_images && selectedVariation.variation_gallery_images.length > 0) {
       this.selectedImages[productId] = selectedVariation.variation_gallery_images[0].archive_src;
     } else {
       this.selectedImages[productId] = '';
     }
   }
 
   getColorOption(variations: any[]): string[] {
     return variations.map(variation => variation.attributes.attribute_pa_color);
   }
 
 
   colorFilter(color: any) {
    this.page = 1;
     if (this.colorName === color.slug) {
       this.colorName = '';
     } else {
       this.colorName = color.slug;
     }
     this.getProductsList();
   }
 
   selectSorting(e: any){
     this.filterType = e.target.value;
     this.getProductsList();
   }
 
 
   variationsImg(items: any): string {
     if (items && items.length > 0 && items[0].variation_gallery_images && items[0].variation_gallery_images.length > 0) {
       return items[0].variation_gallery_images[0].archive_src;
     }
     return 'default-image-src';
   }
 
 
   getImageSrc(items: any): string {
     const productId = items.id;
     if (this.selectedImages[productId]) {
       return this.selectedImages[productId];
     } else if (items.variations && items.variations.length > 0) {
       return this.variationsImg(items.variations);
     } else {
       return items.images[0]?.src || 'myImgUrl';
     }
   }
 
   normalizeOption(option: string): string {
     return option.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
   }
 
   async getColorsName() {
     await this.productservice.getAllColors().subscribe((colors : any )=> {
      if(colors){
       this.allPaColor = colors;
      }
     });
   }
 
 
   ngOnInit(): void {
     this.getColorsName();
     this.getProductsList();
   }




 
}
