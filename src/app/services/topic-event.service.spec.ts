import { TestBed } from '@angular/core/testing';

import { TopicEventService } from './topic-event.service';

describe('TopicEventServiceService', () => {
  let service: TopicEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
