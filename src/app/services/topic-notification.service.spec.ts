import { TestBed } from '@angular/core/testing';

import { TopicNotificationService } from './topic-notification.service';

describe('TopicNotificationService', () => {
  let service: TopicNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
