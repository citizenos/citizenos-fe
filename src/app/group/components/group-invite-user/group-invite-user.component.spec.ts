import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInviteUserComponent } from './group-invite-user.component';

describe('GroupInviteUserComponent', () => {
  let component: GroupInviteUserComponent;
  let fixture: ComponentFixture<GroupInviteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupInviteUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInviteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
