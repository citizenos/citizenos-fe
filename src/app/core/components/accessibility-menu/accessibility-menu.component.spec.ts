import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityMenuComponent } from './accessibility-menu.component';

describe('AccessibilityMenuComponent', () => {
  let component: AccessibilityMenuComponent;
  let fixture: ComponentFixture<AccessibilityMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessibilityMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
