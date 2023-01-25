import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicInviteComponent } from './topic-invite.component';

describe('TopicInviteComponent', () => {
  let component: TopicInviteComponent;
  let fixture: ComponentFixture<TopicInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
