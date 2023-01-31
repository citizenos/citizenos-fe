import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportFormDialogComponent } from './topic-report-form-dialog.component';

describe('TopicReportFormDialogComponent', () => {
  let component: TopicReportFormDialogComponent;
  let fixture: ComponentFixture<TopicReportFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
