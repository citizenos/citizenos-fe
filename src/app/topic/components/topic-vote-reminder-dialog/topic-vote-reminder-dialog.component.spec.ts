import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteReminderDialogComponent } from './topic-vote-reminder-dialog.component';

describe('TopicVoteReminderDialogComponent', () => {
  let component: TopicVoteReminderDialogComponent;
  let fixture: ComponentFixture<TopicVoteReminderDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicVoteReminderDialogComponent]
    });
    fixture = TestBed.createComponent(TopicVoteReminderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
