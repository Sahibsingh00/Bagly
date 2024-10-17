import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss']
})
export class AccessoriesComponent implements OnInit {
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
