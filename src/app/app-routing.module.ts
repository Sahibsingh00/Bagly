import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { SignupComponent } from './core/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { BagsComponent } from './bags/bags.component';
import { AccessoriesComponent } from './accessories/accessories.component';
import { CollectionsComponent } from './collections/collections.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CartComponent } from './cart/cart.component';
import { RimborsoResoComponent } from './rimborso-reso/rimborso-reso.component';
import { InformazioniLegaliComponent } from './informazioni-legali/informazioni-legali.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { DirittoDiRecessoComponent } from './diritto-di-recesso/diritto-di-recesso.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPoilcyComponent } from './privacy-poilcy/privacy-poilcy.component';
import { CategoryComponent } from './category/category.component';
import { AccountComponent } from './account/account.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: HomeComponent},
  { path: 'bags', component: BagsComponent },
  { path: 'accessories', component: AccessoriesComponent },
  { path: 'shop', component: CollectionsComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'product/:postslug', component: ProductComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'thankyou', component: ThankYouComponent },
  { path: 'account', component: AccountComponent },
  { path: 'category/:postslug', component: CategoryComponent },
  {path: 'privacy-policy', component: PrivacyPoilcyComponent},
  {path: 'termini-e-condizioni', component: TermsAndConditionsComponent},
  { path: 'diritto-di-recesso', component: DirittoDiRecessoComponent },
  { path: 'cookie-policy', component: CookiePolicyComponent},
  { path: 'informazioni-legali', component: InformazioniLegaliComponent },
  { path: 'rimborso_reso', component: RimborsoResoComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
