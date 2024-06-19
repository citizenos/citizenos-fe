import { TestBed } from '@angular/core/testing';

import { TopicDiscussionService } from './topic-discussion.service';

describe('TopicDiscussionService', () => {
  let service: TopicDiscussionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicDiscussionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
