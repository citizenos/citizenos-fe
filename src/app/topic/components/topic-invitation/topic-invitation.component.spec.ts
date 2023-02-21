import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicInvitationComponent } from './topic-invitation.component';

describe('TopicInvitationComponent', () => {
  let component: TopicInvitationComponent;
  let fixture: ComponentFixture<TopicInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicInvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
