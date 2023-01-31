import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportReviewDialogComponent } from './topic-report-review-dialog.component';

describe('TopicReportReviewDialogComponent', () => {
  let component: TopicReportReviewDialogComponent;
  let fixture: ComponentFixture<TopicReportReviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportReviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
