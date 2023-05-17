import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteDelegateComponent } from './topic-vote-delegate.component';

describe('TopicVoteDelegateComponent', () => {
  let component: TopicVoteDelegateComponent;
  let fixture: ComponentFixture<TopicVoteDelegateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicVoteDelegateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicVoteDelegateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
