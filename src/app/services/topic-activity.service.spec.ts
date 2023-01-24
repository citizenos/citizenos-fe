import { TestBed } from '@angular/core/testing';

import { TopicActivityService } from './topic-activity.service';

describe('TopicActivityService', () => {
  let service: TopicActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
