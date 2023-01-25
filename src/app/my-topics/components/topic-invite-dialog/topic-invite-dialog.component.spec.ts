import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicInviteDialogComponent } from './topic-invite-dialog.component';

describe('TopicInviteDialogComponent', () => {
  let component: TopicInviteDialogComponent;
  let fixture: ComponentFixture<TopicInviteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicInviteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicInviteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
