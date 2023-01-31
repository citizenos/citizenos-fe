import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportResolveDialogComponent } from './topic-report-resolve-dialog.component';

describe('TopicReportResolveDialogComponent', () => {
  let component: TopicReportResolveDialogComponent;
  let fixture: ComponentFixture<TopicReportResolveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportResolveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportResolveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
