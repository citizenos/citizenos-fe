import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReportReasonComponent } from './idea-report-reason.component';

describe('IdeaReportReasonComponent', () => {
  let component: IdeaReportReasonComponent;
  let fixture: ComponentFixture<IdeaReportReasonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReportReasonComponent]
    });
    fixture = TestBed.createComponent(IdeaReportReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
