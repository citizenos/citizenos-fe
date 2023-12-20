import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartIdLoginFormComponent } from './smart-id-login-form.component';

describe('SmartIdLoginFormComponent', () => {
  let component: SmartIdLoginFormComponent;
  let fixture: ComponentFixture<SmartIdLoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartIdLoginFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartIdLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
