import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightingPageComponent } from './lighting-page.component';

describe('LightingPageComponent', () => {
  let component: LightingPageComponent;
  let fixture: ComponentFixture<LightingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LightingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LightingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
