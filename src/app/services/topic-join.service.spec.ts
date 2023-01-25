import { TestBed } from '@angular/core/testing';

import { TopicJoinService } from './topic-join.service';

describe('TopicJoinService', () => {
  let service: TopicJoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicJoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
