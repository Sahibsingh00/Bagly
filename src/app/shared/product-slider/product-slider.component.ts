import { Component, Input, OnInit } from '@angular/core';
import { ServicesService } from '../../core/service/services.service';


@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss']
})
export class ProductSliderComponent implements OnInit {
  @Input() product: any;
  public myImgUrl : string = "assets/images/default-image.jpg";
  public selectedVariation: any;
  public durationInSeconds = 3;
  public activeOption : any;
  public currentSelectedItems : any;
  public defaultSelectedOptions: { [productId: number]: string } = {};
  public selectedImages: { [key: string]: string } = {};
  public activeOptions: { [key: string]: string } = {};


  constructor(
    private productService: ServicesService,
  ) {
  }


  refresspage() {
    this.productService.refressProduct();
  }

  slideConfig = {
      "dots" : true, 
     "slidesToShow": 4,
     "slidesToScroll": 4,
     responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
    };


  
    variationsImg(items: any): string {
      if (items && items.length > 0 && items[0].variation_gallery_images && items[0].variation_gallery_images.length > 0) {
        return items[0].variation_gallery_images[0].archive_src;
      }
      return 'default-image-src';
    }
  
  
    getColorOption(variations: any[]): string[] {
      return variations.map(variation => variation.attributes.attribute_pa_color);
    }
  
  
    selectVariation(items: any, option: string) {
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

  ngOnInit(): void {
   
   
  }

}
