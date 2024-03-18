import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteDeadlineComponent } from './topic-vote-deadline.component';

describe('TopicVoteDeadlineComponent', () => {
  let component: TopicVoteDeadlineComponent;
  let fixture: ComponentFixture<TopicVoteDeadlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicVoteDeadlineComponent]
    });
    fixture = TestBed.createComponent(TopicVoteDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
