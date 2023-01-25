import { TestBed } from '@angular/core/testing';

import { TopicInviteUserService } from './topic-invite-user.service';

describe('TopicInviteUserService', () => {
  let service: TopicInviteUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicInviteUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
