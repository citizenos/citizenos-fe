import { TestBed } from '@angular/core/testing';

import { GroupJoinService } from './group-join.service';

describe('GroupJoinService', () => {
  let service: GroupJoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupJoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
