import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicParticipantsComponent } from './topic-participants.component';

describe('TopicParticipantsComponent', () => {
  let component: TopicParticipantsComponent;
  let fixture: ComponentFixture<TopicParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicParticipantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
