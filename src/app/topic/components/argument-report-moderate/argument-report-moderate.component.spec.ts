import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentReportModerateComponent } from './argument-report-moderate.component';

describe('ArgumentReportModerateComponent', () => {
  let component: ArgumentReportModerateComponent;
  let fixture: ComponentFixture<ArgumentReportModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgumentReportModerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgumentReportModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
