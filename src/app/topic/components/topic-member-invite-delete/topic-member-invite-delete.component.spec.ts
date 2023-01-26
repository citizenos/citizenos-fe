import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMemberInviteDeleteComponent } from './topic-member-invite-delete.component';

describe('TopicMemberInviteDeleteComponent', () => {
  let component: TopicMemberInviteDeleteComponent;
  let fixture: ComponentFixture<TopicMemberInviteDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicMemberInviteDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicMemberInviteDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
