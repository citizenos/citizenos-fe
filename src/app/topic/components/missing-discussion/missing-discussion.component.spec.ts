import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingDiscussionComponent } from './missing-discussion.component';

describe('MissingDiscussionComponent', () => {
  let component: MissingDiscussionComponent;
  let fixture: ComponentFixture<MissingDiscussionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissingDiscussionComponent]
    });
    fixture = TestBed.createComponent(MissingDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
