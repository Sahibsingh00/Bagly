import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocalStorageServie, StorageService } from './core/service/storage.service';
import { ServicesService } from './core/service/services.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { CollectionsComponent } from './collections/collections.component';
import { RimborsoResoComponent } from './rimborso-reso/rimborso-reso.component';
import { HomeComponent } from './home/home.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { BagsComponent } from './bags/bags.component';
import { AccessoriesComponent } from './accessories/accessories.component';
import { SpecialCollectionComponent } from './special-collection/special-collection.component';
import { CartComponent } from './cart/cart.component';
import { InformazioniLegaliComponent } from './informazioni-legali/informazioni-legali.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { DirittoDiRecessoComponent } from './diritto-di-recesso/diritto-di-recesso.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPoilcyComponent } from './privacy-poilcy/privacy-poilcy.component';
import { CategoryComponent } from './category/category.component';
import { AccountComponent } from './account/account.component'; 
import { ThankYouComponent } from './thank-you/thank-you.component';
import { ProductComponent } from './product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SharedModule } from './shared/shared.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { MatTabsModule } from '@angular/material/tabs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ContactComponent } from './contact/contact.component'; 
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './core/service/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnnouncementsComponent,
    BagsComponent,
    AccessoriesComponent,
    SpecialCollectionComponent,
    CartComponent,
    CheckoutComponent,
    ProductComponent,
    ThankYouComponent,
    AccountComponent,
    CategoryComponent,
    PrivacyPoilcyComponent,
    TermsAndConditionsComponent,
    DirittoDiRecessoComponent,
    CookiePolicyComponent,
    InformazioniLegaliComponent,
    RimborsoResoComponent,
    CollectionsComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule,
    CoreModule,
    MatTabsModule,
    SlickCarouselModule,
    NgxImageZoomModule,


    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    
    
  ],
  providers: [
    CookieService,
    LocalStorageServie,
    ServicesService,
    { provide: StorageService, useClass: LocalStorageServie },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
