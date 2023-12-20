import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicFollowUpCreateDialogComponent } from './topic-follow-up-create-dialog.component';

describe('TopicFollowUpCreateDialogComponent', () => {
  let component: TopicFollowUpCreateDialogComponent;
  let fixture: ComponentFixture<TopicFollowUpCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicFollowUpCreateDialogComponent]
    });
    fixture = TestBed.createComponent(TopicFollowUpCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
