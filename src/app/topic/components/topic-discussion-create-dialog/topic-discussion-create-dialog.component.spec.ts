import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicDiscussionCreateDialogComponent } from './topic-discussion-create-dialog.component';

describe('AddTopicDiscussionDialogComponent', () => {
  let component: TopicDiscussionCreateDialogComponent;
  let fixture: ComponentFixture<TopicDiscussionCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicDiscussionCreateDialogComponent]
    });
    fixture = TestBed.createComponent(TopicDiscussionCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
