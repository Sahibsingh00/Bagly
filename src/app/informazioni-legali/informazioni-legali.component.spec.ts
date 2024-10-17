import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformazioniLegaliComponent } from './informazioni-legali.component';

describe('InformazioniLegaliComponent', () => {
  let component: InformazioniLegaliComponent;
  let fixture: ComponentFixture<InformazioniLegaliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformazioniLegaliComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformazioniLegaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
