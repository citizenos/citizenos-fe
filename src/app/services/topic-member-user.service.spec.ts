import { TestBed } from '@angular/core/testing';

import { TopicMemberUserService } from './topic-member-user.service';

describe('TopicMemberUserService', () => {
  let service: TopicMemberUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicMemberUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
