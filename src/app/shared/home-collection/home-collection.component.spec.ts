import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCollectionComponent } from './home-collection.component';

describe('HomeCollectionComponent', () => {
  let component: HomeCollectionComponent;
  let fixture: ComponentFixture<HomeCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
