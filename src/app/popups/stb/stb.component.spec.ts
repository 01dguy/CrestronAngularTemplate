import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StbComponent } from './stb.component';

describe('StbComponent', () => {
  let component: StbComponent;
  let fixture: ComponentFixture<StbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
