import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportModerateComponent } from './topic-report-moderate.component';

describe('TopicReportModerateComponent', () => {
  let component: TopicReportModerateComponent;
  let fixture: ComponentFixture<TopicReportModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportModerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
