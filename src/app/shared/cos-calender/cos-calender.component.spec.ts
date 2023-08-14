import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosCalenderComponent } from './cos-calender.component';

describe('CosCalenderComponent', () => {
  let component: CosCalenderComponent;
  let fixture: ComponentFixture<CosCalenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CosCalenderComponent]
    });
    fixture = TestBed.createComponent(CosCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
