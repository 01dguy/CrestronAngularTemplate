import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSecurityComponent } from './test-security.component';

describe('TestSecurityComponent', () => {
  let component: TestSecurityComponent;
  let fixture: ComponentFixture<TestSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
