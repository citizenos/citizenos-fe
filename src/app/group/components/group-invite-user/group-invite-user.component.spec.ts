import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInviteUserComponent } from './group-invite-user.component';

describe('GroupMemberInviteComponent', () => {
  let component: GroupInviteUserComponent;
  let fixture: ComponentFixture<GroupInviteUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupInviteUserComponent]
    });
    fixture = TestBed.createComponent(GroupInviteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
