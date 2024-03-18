import { TestBed } from '@angular/core/testing';

import { PlausibleService } from './plausible.service';

describe('PlausibleService', () => {
  let service: PlausibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlausibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
