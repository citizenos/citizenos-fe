import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberUserComponent } from './group-member-user.component';

describe('GroupMemberUserComponent', () => {
  let component: GroupMemberUserComponent;
  let fixture: ComponentFixture<GroupMemberUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMemberUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMemberUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
