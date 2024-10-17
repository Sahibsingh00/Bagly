import { Component, Input, OnInit } from '@angular/core';
import { ServicesService } from '../../core/service/services.service';

@Component({
  selector: 'app-model-slider',
  templateUrl: './model-slider.component.html',
  styleUrls: ['./model-slider.component.scss']
})
export class ModelSliderComponent {
  @Input() models: any;
  public loading : boolean = true;
  slideConfig = {
    "dots" : false,
   "slidesToShow": 3,
   "slidesToScroll": 3,
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
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 360,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    }
  ]
  };


  ngOnInit(): void {
    
  }

}
