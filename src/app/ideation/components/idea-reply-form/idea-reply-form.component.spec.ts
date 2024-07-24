import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReplyFormComponent } from './idea-reply-form.component';

describe('IdeaReplyFormComponent', () => {
  let component: IdeaReplyFormComponent;
  let fixture: ComponentFixture<IdeaReplyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReplyFormComponent]
    });
    fixture = TestBed.createComponent(IdeaReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
