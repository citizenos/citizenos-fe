import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartIdLoginComponent } from './smart-id-login.component';

describe('SmartIdLoginComponent', () => {
  let component: SmartIdLoginComponent;
  let fixture: ComponentFixture<SmartIdLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartIdLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartIdLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
