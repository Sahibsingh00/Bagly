import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HomeCollectionComponent } from './home-collection/home-collection.component';
import { LatestProductComponent } from './latest-product/latest-product.component';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { ModelSliderComponent } from './model-slider/model-slider.component';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PageHeaderComponent } from './page-header/page-header.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { ZoomableImageComponent } from './zoomable-image/zoomable-image.component';




@NgModule({
  declarations: [
    HomeCollectionComponent,
    LatestProductComponent,
    ProductSliderComponent,
    ModelSliderComponent,
    PageHeaderComponent,
    LoaderComponent,
    ZoomableImageComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule.forRoot(),
    RouterModule,
    SlickCarouselModule,
    FormsModule
    
  ],
  exports : [
    HomeCollectionComponent,
    LatestProductComponent,
    ProductSliderComponent,
    ModelSliderComponent,
    PageHeaderComponent,
    LoaderComponent,
    ZoomableImageComponent
  ]
})
export class SharedModule { }
