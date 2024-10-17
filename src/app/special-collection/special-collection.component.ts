import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-special-collection',
  templateUrl: './special-collection.component.html',
  styleUrls: ['./special-collection.component.scss']
})
export class SpecialCollectionComponent implements OnInit {
 public productLimit : number = 10;
 pageTitle : string = 'pageTitle';
  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
    this.pageTitle = this.router.url;
    if(this.pageTitle){
      this.pageTitle = this.pageTitle.substring(1)
    }
  }

}
