import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstIdLoginFormComponent } from './est-id-login-form.component';

describe('EstIdLoginFormComponent', () => {
  let component: EstIdLoginFormComponent;
  let fixture: ComponentFixture<EstIdLoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstIdLoginFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstIdLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
