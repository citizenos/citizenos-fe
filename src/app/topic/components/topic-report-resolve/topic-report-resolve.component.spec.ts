import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicReportResolveComponent } from './topic-report-resolve.component';

describe('TopicReportResolveComponent', () => {
  let component: TopicReportResolveComponent;
  let fixture: ComponentFixture<TopicReportResolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicReportResolveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportResolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
