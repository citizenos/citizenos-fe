import { TestBed } from '@angular/core/testing';

import { TopicIdeationService } from './topic-ideation.service';

describe('TopicIdeationService', () => {
  let service: TopicIdeationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicIdeationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
