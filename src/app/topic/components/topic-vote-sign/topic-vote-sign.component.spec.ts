import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteSignComponent } from './topic-vote-sign.component';

describe('TopicVoteSignComponent', () => {
  let component: TopicVoteSignComponent;
  let fixture: ComponentFixture<TopicVoteSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicVoteSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicVoteSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
