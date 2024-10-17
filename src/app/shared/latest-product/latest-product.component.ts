import { Component, Input, OnInit } from '@angular/core';
import { ServicesService } from '../../core/service/services.service';

@Component({
  selector: 'app-latest-product',
  templateUrl: './latest-product.component.html',
  styleUrls: ['./latest-product.component.scss']
})
export class LatestProductComponent implements OnInit {
  public myImgUrl: string = "assets/images/default-image.jpg";
  @Input() limit: any;
  @Input() productList: any;
  public selectedVariation: any = [];
  public variations: any[] = [];
  public durationInSeconds = 3;
  public activeOption : any;

  public defaultSelectedOptions: { [productId: number]: string } = {};
  public selectedImages: { [key: string]: string } = {};
  public activeOptions: { [key: string]: string } = {};
  public isLoading : boolean = false;

  constructor( ) { }

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

  ngOnInit(): void {}

}
