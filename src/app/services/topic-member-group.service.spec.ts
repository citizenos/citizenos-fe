import { TestBed } from '@angular/core/testing';

import { TopicMemberGroupService } from './topic-member-group.service';

describe('TopicMemberGroupService', () => {
  let service: TopicMemberGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicMemberGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
