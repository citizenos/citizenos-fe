import { TestBed } from '@angular/core/testing';

import { TopicCommentService } from './topic-comment.service';

describe('TopicCommentService', () => {
  let service: TopicCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
