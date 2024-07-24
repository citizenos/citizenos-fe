import { TestBed } from '@angular/core/testing';

import { TopicIdeaRepliesService } from './topic-idea-replies.service';

describe('TopicIdeaRepliesService', () => {
  let service: TopicIdeaRepliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicIdeaRepliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
