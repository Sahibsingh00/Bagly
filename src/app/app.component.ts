import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from './core/service/services.service';
import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit{
  title = 'donna-app';
  public spinner : any;
  constructor(
    // private spinner: NgxSpinnerService,
    private productservice: ServicesService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef

  ) { }


  async getColorsName() {
    await this.productservice.getAllColors().subscribe((colors : any )=> {
     if(colors){
      colors.forEach((color : any) => {
        const { slug, color_code } = color;

        const normalizedClassName = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const cssRule = `
          .color-${normalizedClassName} {
            background-color: ${color_code};
          }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = cssRule;
        document.head.appendChild(styleElement);
      });
     }
    });
  }



  ngAfterViewInit() {
    // this.productservice.getFacebookPixelId().subscribe((response: any) => {
    //     if(response && response.id){
    //      this.addFacebookPixelScript(response.id);
    //     }
    //   },

    // );
  }

  addFacebookPixelScript(pixelId: string) {
    const script = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;

    const scriptElement = this.renderer.createElement('script');
    scriptElement.textContent = script;
    this.renderer.appendChild(this.elementRef.nativeElement, scriptElement);

    const noscriptElement = this.renderer.createElement('noscript');
    const imgElement = this.renderer.createElement('img');
    this.renderer.setStyle(imgElement, 'height', '1');
    this.renderer.setStyle(imgElement, 'width', '1');
    this.renderer.setStyle(imgElement, 'display', 'none');
    this.renderer.setAttribute(imgElement, 'src', `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`);
    this.renderer.appendChild(noscriptElement, imgElement);
    this.renderer.appendChild(this.elementRef.nativeElement, noscriptElement);
  }

  


  ngOnInit(): void {

    this.productservice.getCartFromServer().subscribe((res : any)=>{
      this.productservice.saveCartToStorage(res);
    });

    this.getColorsName();
    this.productservice.loading.subscribe((res : any)=>{
      this.spinner = true;
      this.cdr.detectChanges();
    });

    this.productservice.stopLoading.subscribe((res : any)=>{
      this.spinner = false;
      this.cdr.detectChanges();
    });

  }





}
