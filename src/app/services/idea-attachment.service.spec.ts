import { TestBed } from '@angular/core/testing';

import { IdeaAttachmentService } from './idea-attachment.service';

describe('IdeaAttachmentService', () => {
  let service: IdeaAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdeaAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
