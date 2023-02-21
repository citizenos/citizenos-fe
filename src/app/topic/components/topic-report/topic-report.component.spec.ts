import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportComponent } from './topic-report.component';

describe('TopicReportComponent', () => {
  let component: TopicReportComponent;
  let fixture: ComponentFixture<TopicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
