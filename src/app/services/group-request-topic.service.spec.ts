import { TestBed } from '@angular/core/testing';

import { GroupRequestTopicService } from './group-request-topic.service';

describe('GroupRequestTopicService', () => {
  let service: GroupRequestTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupRequestTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
