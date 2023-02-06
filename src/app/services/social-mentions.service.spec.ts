import { TestBed } from '@angular/core/testing';

import { SocialMentionsService } from './social-mentions.service';

describe('SocialMentionsService', () => {
  let service: SocialMentionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialMentionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
