import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentReportComponent } from './argument-report.component';

describe('ArgumentReportComponent', () => {
  let component: ArgumentReportComponent;
  let fixture: ComponentFixture<ArgumentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgumentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgumentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
