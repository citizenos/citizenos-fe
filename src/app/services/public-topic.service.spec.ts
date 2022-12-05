import { TestBed } from '@angular/core/testing';

import { PublicTopicService } from './public-topic.service';

describe('PublicTopicService', () => {
  let service: PublicTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
