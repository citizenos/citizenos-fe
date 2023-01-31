import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteCreateComponent } from './topic-vote-create.component';

describe('TopicVoteCreateComponent', () => {
  let component: TopicVoteCreateComponent;
  let fixture: ComponentFixture<TopicVoteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicVoteCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicVoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
