import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { TopicService } from './topic.service';
import { Observable, BehaviorSubject, map, switchMap, tap, of, catchError, distinct, EMPTY } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Topic } from 'src/app/interfaces/topic';

@Injectable({
  providedIn: 'root'
})
export class UserTopicService {
  defaultParams = {
    showModerated:<boolean> false,
    offset:<number> 0,
    limit:<number> 26,
    statuses: <Array<string> | null> null,
    include: <Array<string>  | null> null,
    categories: <Array<string> | null> null,
    sourcePartnerId: <string | null> null,
    title: <string | null> null,
    prefix: <string | null> null,
    userId: <string | null> null,
    visibility: <string | null> null,
    hasVoted: <boolean | null>null,
    creatorId: <string | null> null,
    pinned: <boolean | null>null,
  };

  params$ = new BehaviorSubject(this.defaultParams);

  STATUSES = <string[]> ['inProgress', // Being worked on
    'voting', // Is being voted which means the Topic is locked and cannot be edited.
    'followUp', // Done editing Topic and executing on the follow up plan.
    'closed' // Final status - Topic is completed and no editing/reopening/voting can occur.
  ];

  VISIBILITY = [
      'public', // Everyone has read-only on the Topic.  Pops up in the searches..
      'private' // No-one can see except collaborators
  ];

  private allTopics$: Topic[] = [];
  topics$: Observable<Topic[]> = of([]);
  hasMore$ = new BehaviorSubject(false);
  countTotal$ = new BehaviorSubject(0);

  constructor(private TopicService: TopicService, private Auth: AuthService) {
    this.topics$ = this.loadTopics();
  }

  loadMore() {
    this.params$.value.offset = this.params$.value.offset += this.params$.value.limit;
    this.params$.next(this.params$.value);
  }

  loadTopics (): Observable<Topic[]> {
    return this.params$.pipe(
      switchMap((params) => {
        return this.getTopics(params);
      })
    )
  }

  getTopics(params: any) {
    return this.TopicService.query(params).pipe(
      map((res: ApiResponse) => {
        this.countTotal$.next(res.data.countTotal || 0);

        return Array.from<Topic>(res.data.rows);
      }),
      tap((topics) => {
        this.allTopics$ = this.allTopics$.concat(topics);
        let hasmore = false;
        if (this.allTopics$.length < this.countTotal$.value) {
          hasmore=true;
        }
        this.hasMore$.next(hasmore);
      }),
      map(() => {
        return this.allTopics$
      }),
      distinct(),
      catchError(() => EMPTY)
    );
  }

  setCategory (category: string) {
    const params = this.params$.value;
    params.categories = [category];
    this.params$.next(params);
  }

  setStatus (status: string) {
    const params = this.params$.value;
    params.statuses = [status];
    console.log(params.statuses);
    this.params$.next(params);
  }

  filterTopics(filter: string) {
    this.allTopics$ = [];
    const filters = this.defaultParams;
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

    this.params$.next(filters);
  }
}
