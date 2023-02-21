import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInvitationComponent } from './group-invitation.component';

describe('GroupInvitationComponent', () => {
  let component: GroupInvitationComponent;
  let fixture: ComponentFixture<GroupInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupInvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
