import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReplyComponent } from './idea-reply.component';

describe('IdeaReplyComponent', () => {
  let component: IdeaReplyComponent;
  let fixture: ComponentFixture<IdeaReplyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReplyComponent]
    });
    fixture = TestBed.createComponent(IdeaReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
