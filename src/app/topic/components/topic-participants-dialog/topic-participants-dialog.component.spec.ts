import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicParticipantsDialogComponent } from './topic-participants-dialog.component';

describe('TopicParticipantsDialogComponent', () => {
  let component: TopicParticipantsDialogComponent;
  let fixture: ComponentFixture<TopicParticipantsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicParticipantsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicParticipantsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
