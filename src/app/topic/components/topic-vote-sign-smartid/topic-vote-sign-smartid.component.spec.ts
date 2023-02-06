import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicVoteSignSmartidComponent } from './topic-vote-sign-smartid.component';

describe('TopicVoteSignSmartidComponent', () => {
  let component: TopicVoteSignSmartidComponent;
  let fixture: ComponentFixture<TopicVoteSignSmartidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicVoteSignSmartidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicVoteSignSmartidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
