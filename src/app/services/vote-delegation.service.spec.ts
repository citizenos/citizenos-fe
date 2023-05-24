import { TestBed } from '@angular/core/testing';

import { VoteDelegationService } from './vote-delegation.service';

describe('VoteDelegationService', () => {
  let service: VoteDelegationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteDelegationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
