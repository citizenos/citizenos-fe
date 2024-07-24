import { TestBed } from '@angular/core/testing';

import { TopicIdeaService } from './topic-idea.service';

describe('TopicIdeaService', () => {
  let service: TopicIdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicIdeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
