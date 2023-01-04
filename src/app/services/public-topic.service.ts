import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Observable, BehaviorSubject, map, switchMap, tap, of, catchError, distinct, EMPTY } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Topic } from 'src/app/interfaces/topic';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicTopicService {
  private defaultParams = {
    showModerated: <boolean>false,
    offset: <number>0,
    limit: <number>8,
    statuses: <Array<string> | null>null,
    include: <Array<string> | null>null,
    categories: <Array<string> | null>null,
    sourcePartnerId: <string | null>null,
    title: <string | null>null,
    prefix: <string | null>'',
    userId: <string | null>'',
    visibility: <string | null>'',
    hasVoted: <boolean | null>null,
    creatorId: <string | null>'',
    pinned: <boolean | null>null,
  };

  STATUSES = <string[]> ['inProgress', // Being worked on
    'voting', // Is being voted which means the Topic is locked and cannot be edited.
    'followUp', // Done editing Topic and executing on the follow up plan.
    'closed' // Final status - Topic is completed and no editing/reopening/voting can occur.
  ];

  VISIBILITY = [
      'public', // Everyone has read-only on the Topic.  Pops up in the searches..
      'private' // No-one can see except collaborators
  ];

  params$ = new BehaviorSubject(this.defaultParams);
  hasMore$ = new BehaviorSubject(false);
  countTotal$ = new BehaviorSubject(0);

  constructor(private http: HttpClient, private Location: LocationService, private Auth: AuthService) {
  }

  reload() {
    this.params$.next(this.defaultParams)
  };

  loadMore() {
    this.params$.value.offset = this.params$.value.offset += this.params$.value.limit;
    this.params$.next(this.params$.value);
  }

  loadTopics(): Observable<Topic[]> {
    return this.params$.pipe(
      switchMap((params) => {
        return this.getTopics(params);
      })
    )
  }

  getTopics(params?: any) {
    return this.queryPublic(params).pipe(
      map((res: ApiResponse) => {
        this.countTotal$.next(res.data.countTotal || 0);

        return Array.from<Topic>(res.data.rows);
      }),
      tap<Topic[]>((topics) => {
        let hasmore = true;
        if (topics.length < this.params$.value['limit']) {
          hasmore = false;
        }
        this.hasMore$.next(hasmore);
      }),
      distinct(),
      catchError(() => EMPTY)
    );
  }

  queryPublic(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/topics');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { params: queryParams, observe: 'body', responseType: 'json' });
  };

  setCategory(category: string) {
    const params = this.params$.value;
    params.categories = [category];
    this.params$.next(params);
  }

  setStatus(status: string) {
    const params = this.params$.value;
    params.statuses = [status];
    this.params$.next(params);
  }

  filterTopics(filter: string) {
    const filters = this.params$.value;
    if (this.STATUSES.indexOf(filter) > -1) {
      filters.statuses = [filter];
    } else if (this.VISIBILITY.indexOf(filter) > -1) {
      filters.visibility = filter;
    } else {
      switch (filter) {
        case 'all':
          break;
        case 'haveVoted':
          filters.hasVoted = true;
          break;
        case 'haveNotVoted':
          filters.hasVoted = false;
          break;
        case 'iCreated':
          filters.creatorId = this.Auth.user.value.id;
          break;
        case 'pinnedTopics':
          filters.pinned = true;
          break;
        case 'showModerated':
          filters.showModerated = true;
          break;
      };
    }
  }
}
