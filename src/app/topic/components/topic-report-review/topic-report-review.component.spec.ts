import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportReviewComponent } from './topic-report-review.component';

describe('TopicReportReviewComponent', () => {
  let component: TopicReportReviewComponent;
  let fixture: ComponentFixture<TopicReportReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
