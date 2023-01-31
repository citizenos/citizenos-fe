import { TestBed } from '@angular/core/testing';

import { TopicReportService } from './topic-report.service';

describe('TopicReportService', () => {
  let service: TopicReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
