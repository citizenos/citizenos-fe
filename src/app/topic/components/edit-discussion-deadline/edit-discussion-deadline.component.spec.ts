import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiscussionDeadlineComponent } from './edit-discussion-deadline.component';

describe('EditDiscussionDeadlineComponent', () => {
  let component: EditDiscussionDeadlineComponent;
  let fixture: ComponentFixture<EditDiscussionDeadlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDiscussionDeadlineComponent]
    });
    fixture = TestBed.createComponent(EditDiscussionDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
