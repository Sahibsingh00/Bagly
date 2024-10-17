import { Component, ElementRef, HostListener, OnInit, Renderer2, RendererFactory2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ServicesService } from '../core/service/services.service';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductType } from './ProductModel';
import { filter } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { FooterComponent } from '../core/footer/footer.component';

declare var Scalapay: any; 

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public btnloading: boolean = false;
  public Defaultproduct: ProductType = JSON.parse(JSON.stringify(Product));
  public cartitems: any = [];
  public durationInSeconds = 3;
  public selectedVariation: any;
  public variations: any[] = [];
  public categories: any[] = [];
  public cartData: any;
  public activeOption: any;
  public popupVisible: boolean = false;
  public offsetX: any;
  public offsetY: any;
  public filteredMetaData: any[] = [];
  public GallaryImages : any;
  public AllGallaryImages : any [] = [];
  public productList : any = [];
  public slideConfig : any;
  public product : any = [];
  private renderer: Renderer2;


  public defaultGallary : any = [{
          "url": "assets/images/dummyImg.png"},
          {"url": "assets/images/dummyImg.png"},
  ];

  @ViewChild('colorVariationList') colorVariationList!: ElementRef;

  overFlowHidden(){
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }


  constructor(
    private route: ActivatedRoute,
    private productService: ServicesService,
    private toastr: ToastrService,
    rendererFactory: RendererFactory2,
    private router: Router
  ) {  
    this.product = this.Defaultproduct;
    this.GallaryImages = this.defaultGallary;
    this.filteredMetaData = this.product.meta_data.filter((item : any) => {
      return item.key === 'dimensioni' || item.key === 'materiali' || item.key === 'cose_da_sapere';
  });
  this.renderer = rendererFactory.createRenderer(null, null);
  }




  clickFirstElement(){
    if (this.colorVariationList) {
      const firstListItem = this.colorVariationList.nativeElement.querySelector('li');
      if (firstListItem) {
        firstListItem.click();
      }
    } else {
      console.error('colorVariationList is still undefined after timeout.');
    } 
  }

  handlePopupClick(event: MouseEvent): void {
    if (!event.target) {
      this.popupVisible = false;
      return;
    }
    const featureImage = (event.target as HTMLElement).closest('.feature-image');
    const slideBlock1 = (event.target as HTMLElement).closest('.slide_block_1');
    if (!featureImage && !slideBlock1) {
      this.popupVisible = false;
    }
  }


hideZoom(){
  this.renderer.removeStyle(document.body, 'overflow'); 
  this.popupVisible = false;
}


  currentPicture = 0;
  select(index: any) {
    this.currentPicture = index;
  }

  selectArrow() {
    if (this.currentPicture < this.GallaryImages.length - 1) {
      this.currentPicture++;
    }
  }


  selectLeftArrow() {
    if (this.currentPicture > 0) {
      this.currentPicture--;
    }
  }


async getproduct(slug : string){
  this.productService.loader();
  await this.productService.getSingleProduct(slug)
      .subscribe({ next: (data: any) => {
        this.product = data;
        window.scrollTo(0, 0);
        if(!this.product.variations){
          this.GallaryImages = this.product.gallery_images;
        }else{
          this.GallaryImages = this.product.variations[0].variation_gallery_images;
        }
        if (this.product && this.product.meta_data) {
          this.filteredMetaData = this.product.meta_data.filter((item : any) => {
              return item.key === 'dimensioni' || item.key === 'materiali' || item.key === 'cose_da_sapere';
          });

      }
      }, error: (error) => {
       this.productService.noLoader();
      }, complete: () => {
       this.productService.noLoader();
      }
    });
}


  getColorOption(variations: any[]): string[] {
    return variations.map(variation => variation.attributes.attribute_pa_color);
  }


  selectVariation(variationID: any) {
    this.GallaryImages = this.defaultGallary;
    this.GallaryImages = variationID.variation_gallery_images;
    this.selectedVariation = variationID;
  }


getKeyLabel(key: string): string {
  switch (key) {
      case 'dimensioni':
          return 'Dimensioni';
      case 'materiali':
          return 'Materiali';
      case 'cose_da_sapere':
          return 'Cose da sapere';
      default:
          return '';
  }
}
   


formatCategories(categories: any[]): string {
  if (!categories || categories.length === 0) {
    return '';
  }

  if (categories.length === 1) {
    return categories[0];
  }

  if (categories.length === 2) {
    return `${categories[0]} and ${categories[1]}`;
  }

  const categoryNames = categories.slice(0, -1);
  const lastCategory = categories[categories.length - 1];
  return `${categoryNames.join(', ')} and ${lastCategory}`;
}

normalizeOption(option: string): string {
  return option.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}


  /**
   * Create add to product function
   * @param product 
   */
  public addProductToCart(product: any): void {
    this.btnloading = true;
    if (product && product.variations) {
      if (this.selectedVariation) {
        this.productService.addSimpleProductToCart(this.selectedVariation.variation_id, 1).subscribe((res: any) => {
          if (res) {
            this.productService.saveCartToStorage(res);
            this.toastr.success('Nuovo prodotto aggiunto con successo nel carrello!', '');
            this.productService.addTocartProduct();
            this.btnloading = false;
          } else {
            this.btnloading = false;
          }

        });
      } else {
        this.toastr.warning('Seleziona il colore del prodotto!', 'Avvertimento');
        this.btnloading = false;
      }
    } else {
      this.productService.addSimpleProductToCart(product.id, 1).subscribe((res: any) => {
        if (res) {
          this.productService.saveCartToStorage(res);
          this.toastr.success('Nuovo prodotto aggiunto con successo nel carrello!', '');
          this.productService.addTocartProduct();
          this.btnloading = false;
        } else {
          this.btnloading = false;
        }
      });
    }

  }


  async listAllProduct(slug: any) {
    await this.productService.shopAllProductsWithVariations(12, 1, '', '',).subscribe((res: any) => {
      if (res) {
        this.productList = res.filter((product: any) => product.slug !== slug);
        for (let i = this.productList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.productList[i], this.productList[j]] = [this.productList[j], this.productList[i]];
        }
      }
    });
  }



  ngOnInit(): void {
    let data = this.route.snapshot.params;
    if (data && data['postslug']) {  
      this.getproduct(data['postslug']);
      this.listAllProduct(data['postslug']);
    }


    this.productService.refressSingleProduct.subscribe((res: any) => {
      this.product = this.Defaultproduct;
      setTimeout(() => {
        let data2 = this.route.snapshot.params;
        if (data2 && data2['postslug']) {
          this.getproduct(data2['postslug']);
          this.listAllProduct(data2['postslug']);
        }
      }, 100);
    });

    this.slideConfig = {
      "dots": true,
      "slidesToShow": 1,
      "slidesToScroll": 1,
    };
  }







}






