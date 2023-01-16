import { TestBed } from '@angular/core/testing';

import { GroupMemberUsersService } from './group-member-users.service';

describe('GroupMemberUsersService', () => {
  let service: GroupMemberUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupMemberUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
