import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMemberInviteComponent } from './topic-member-invite.component';

describe('TopicMemberInviteComponent', () => {
  let component: TopicMemberInviteComponent;
  let fixture: ComponentFixture<TopicMemberInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicMemberInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicMemberInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
