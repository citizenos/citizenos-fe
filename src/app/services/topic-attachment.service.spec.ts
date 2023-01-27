import { TestBed } from '@angular/core/testing';

import { TopicAttachmentService } from './topic-attachment.service';

describe('TopicAttachmentService', () => {
  let service: TopicAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
