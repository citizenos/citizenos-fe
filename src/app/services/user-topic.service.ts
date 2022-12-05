import { Injectable } from '@angular/core';
import { TopicService } from './topic.service';
import { Observable, BehaviorSubject, map, switchMap, tap, of, catchError, distinct, EMPTY } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Topic } from 'src/app/interfaces/topic';

@Injectable({
  providedIn: 'root'
})
export class UserTopicService {
  params$ = new BehaviorSubject({
    showModerated:<boolean> false,
    offset:<number> 0,
    limit:<number> 26,
    statuses: <Array<string> | null> null,
    include: <Array<string>  | null> null,
    categories: <Array<string> | null> null,
    sourcePartnerId: <string | null> null,
    title: <string | null> null
  });

  private allTopics$: Topic[] = [];
  topics$: Observable<Topic[]> = of([]);
  hasMore$ = new BehaviorSubject(false);
  countTotal$ = new BehaviorSubject(0);

  constructor(private TopicService: TopicService) {
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
}
