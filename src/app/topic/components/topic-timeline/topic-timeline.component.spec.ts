import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTimelineComponent } from './topic-timeline.component';

describe('TopicTimelineComponent', () => {
  let component: TopicTimelineComponent;
  let fixture: ComponentFixture<TopicTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
