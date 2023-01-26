import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteCastComponent } from './topic-vote-cast.component';

describe('TopicVoteCastComponent', () => {
  let component: TopicVoteCastComponent;
  let fixture: ComponentFixture<TopicVoteCastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicVoteCastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicVoteCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
