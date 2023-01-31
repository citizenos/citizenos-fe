import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportModerateDialogComponent } from './topic-report-moderate-dialog.component';

describe('TopicReportModerateDialogComponent', () => {
  let component: TopicReportModerateDialogComponent;
  let fixture: ComponentFixture<TopicReportModerateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportModerateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportModerateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
