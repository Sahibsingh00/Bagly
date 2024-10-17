import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RimborsoResoComponent } from './rimborso-reso.component';

describe('RimborsoResoComponent', () => {
  let component: RimborsoResoComponent;
  let fixture: ComponentFixture<RimborsoResoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RimborsoResoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RimborsoResoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
