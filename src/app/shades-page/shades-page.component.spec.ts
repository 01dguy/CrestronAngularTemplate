import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadesPageComponent } from './shades-page.component';

describe('ShadesPageComponent', () => {
  let component: ShadesPageComponent;
  let fixture: ComponentFixture<ShadesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShadesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShadesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
