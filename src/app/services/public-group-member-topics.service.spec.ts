import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PublicGroupMemberTopicsService } from './public-group-member-topics.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

describe('PublicGroupMemberTopicsService.reload', () => {
  let service: PublicGroupMemberTopicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PublicGroupMemberTopicsService
      ]
    });
    service = TestBed.inject(PublicGroupMemberTopicsService);
  });

  it('should reset offset to 0', () => {
    service.params$.value.offset = 10;
    service.reload();
    expect(service.params$.value.offset).toBe(0);
  });

  it('should reset page to 1', () => {
    service.params$.value.page = 5;
    service.reload();
    expect(service.params$.value.page).toBe(1);
  });

  it('should maintain other params values', () => {
    service.params$.value.order = 'asc';
    service.reload();
    expect(service.params$.value.order).toBe('asc');
  });
});

// Add interface for params
interface Params {
  offset: number;
  page: number;
  order: string;
}

const DEFAULT_OFFSET = 10;
const DEFAULT_PAGE = 5;
const DEFAULT_ORDER = 'asc';
