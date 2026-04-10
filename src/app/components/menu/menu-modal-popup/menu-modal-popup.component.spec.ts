import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuModalPopupComponent } from './menu-modal-popup.component';

describe('MenuModalPopupComponent', () => {
  let component: MenuModalPopupComponent;
  let fixture: ComponentFixture<MenuModalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuModalPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
