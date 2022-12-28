import { TestBed } from '@angular/core/testing';

import { PublicGroupService } from './public-group.service';

describe('PublicGroupService', () => {
  let service: PublicGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
