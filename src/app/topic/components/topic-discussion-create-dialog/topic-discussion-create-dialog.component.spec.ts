import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTopicDiscussionDialogComponent } from './topic-discussion-create-dialog.component';

describe('AddTopicDiscussionDialogComponent', () => {
  let component: AddTopicDiscussionDialogComponent;
  let fixture: ComponentFixture<AddTopicDiscussionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTopicDiscussionDialogComponent]
    });
    fixture = TestBed.createComponent(AddTopicDiscussionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
