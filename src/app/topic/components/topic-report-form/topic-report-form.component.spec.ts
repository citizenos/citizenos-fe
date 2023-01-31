import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportFormComponent } from './topic-report-form.component';

describe('TopicReportFormComponent', () => {
  let component: TopicReportFormComponent;
  let fixture: ComponentFixture<TopicReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
