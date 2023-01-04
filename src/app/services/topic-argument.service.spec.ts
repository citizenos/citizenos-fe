import { TestBed } from '@angular/core/testing';

import { TopicArgumentService } from './topic-argument.service';

describe('TopicCommentService', () => {
  let service: TopicArgumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicArgumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
