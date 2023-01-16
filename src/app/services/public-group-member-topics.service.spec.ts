import { TestBed } from '@angular/core/testing';

import { PublicGroupMemberTopicsService } from './public-group-member-topics.service';

describe('PublicGroupMemberTopicsService', () => {
  let service: PublicGroupMemberTopicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicGroupMemberTopicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
