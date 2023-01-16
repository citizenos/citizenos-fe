import { TestBed } from '@angular/core/testing';

import { GroupInviteUserService } from './group-invite-user.service';

describe('GroupInviteUserService', () => {
  let service: GroupInviteUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupInviteUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
