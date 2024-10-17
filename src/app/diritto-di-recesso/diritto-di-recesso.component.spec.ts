import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirittoDiRecessoComponent } from './diritto-di-recesso.component';

describe('DirittoDiRecessoComponent', () => {
  let component: DirittoDiRecessoComponent;
  let fixture: ComponentFixture<DirittoDiRecessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirittoDiRecessoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirittoDiRecessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
