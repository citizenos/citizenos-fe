import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteSignEsteidComponent } from './topic-vote-sign-esteid.component';

describe('TopicVoteSignEsteidComponent', () => {
  let component: TopicVoteSignEsteidComponent;
  let fixture: ComponentFixture<TopicVoteSignEsteidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicVoteSignEsteidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicVoteSignEsteidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
