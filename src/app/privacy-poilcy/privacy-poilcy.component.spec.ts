import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPoilcyComponent } from './privacy-poilcy.component';

describe('PrivacyPoilcyComponent', () => {
  let component: PrivacyPoilcyComponent;
  let fixture: ComponentFixture<PrivacyPoilcyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyPoilcyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivacyPoilcyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
