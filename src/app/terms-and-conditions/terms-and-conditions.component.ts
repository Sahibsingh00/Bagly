import { Component } from '@angular/core';
import { ServicesService } from '../core/service/services.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent{

  constructor(private service: ServicesService) { }

  ngOnInit(): void {
  }

}
