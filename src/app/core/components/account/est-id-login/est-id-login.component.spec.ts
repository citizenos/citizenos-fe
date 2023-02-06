import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstIdLoginComponent } from './est-id-login.component';

describe('EstIdLoginComponent', () => {
  let component: EstIdLoginComponent;
  let fixture: ComponentFixture<EstIdLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstIdLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstIdLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
