import { TestBed } from '@angular/core/testing';

import { GroupMemberTopicService } from './group-member-topic.service';

describe('GroupMemberTopicService', () => {
  let service: GroupMemberTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupMemberTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
