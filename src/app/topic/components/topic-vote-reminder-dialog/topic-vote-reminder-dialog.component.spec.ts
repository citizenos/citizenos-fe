import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteReminderDialog } from './topic-vote-reminder-dialog.component';

describe('TopicVoteReminderDialog', () => {
  let component: TopicVoteReminderDialog;
  let fixture: ComponentFixture<TopicVoteReminderDialog>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicVoteReminderDialog]
    });
    fixture = TestBed.createComponent(TopicVoteReminderDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
