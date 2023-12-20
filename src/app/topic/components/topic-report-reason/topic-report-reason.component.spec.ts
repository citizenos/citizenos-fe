import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportReasonComponent } from './topic-report-reason.component';

describe('TopicReportReasonComponent', () => {
  let component: TopicReportReasonComponent;
  let fixture: ComponentFixture<TopicReportReasonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicReportReasonComponent]
    });
    fixture = TestBed.createComponent(TopicReportReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
