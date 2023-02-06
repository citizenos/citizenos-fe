import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDatepickerComponent } from './modal-datepicker.component';

describe('ModalDatepickerComponent', () => {
  let component: ModalDatepickerComponent;
  let fixture: ComponentFixture<ModalDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
