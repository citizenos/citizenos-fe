import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberTopicComponent } from './group-member-topic.component';

describe('GroupMemberTopicComponent', () => {
  let component: GroupMemberTopicComponent;
  let fixture: ComponentFixture<GroupMemberTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMemberTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMemberTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
