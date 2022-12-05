import { TestBed } from '@angular/core/testing';

import { UserTopicService } from './user-topic.service';

describe('UserTopicService', () => {
  let service: UserTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
