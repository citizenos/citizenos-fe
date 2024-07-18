import { TestBed } from '@angular/core/testing';

import { TopicIdeationFoldersService } from './topic-ideation-folders.service';

describe('TopicIdeationFoldersService', () => {
  let service: TopicIdeationFoldersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicIdeationFoldersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
