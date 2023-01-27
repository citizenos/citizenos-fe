import { TestBed } from '@angular/core/testing';

import { TopicVoteService } from './topic-vote.service';

describe('TopicVoteService', () => {
  let service: TopicVoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicVoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
