import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, switchMap, tap, of, catchError, distinct, EMPTY } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Group } from 'src/app/interfaces/group';
import { LocationService } from './location.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicGroupService {

  params$ = new BehaviorSubject({
    showModerated:<boolean> false,
    offset:<number> 0,
    limit:<number> 8,
    orderBy: <string | null> 'name',
    order: <string | null> 'ASC',
    sourcePartnerId: <string | null> null,
    search: <string | null> null
  });

  private allGroups$: Group[] = [];
  groups$: Observable<Group[]> = of([]);
  hasMore$ = new BehaviorSubject(false);
  countTotal$ = new BehaviorSubject(0);
  page$ = new BehaviorSubject(0);

  constructor(private Location: LocationService,private http: HttpClient) {
    this.groups$ = this.loadGroups();
  }

  loadMore() {
    this.params$.value.offset = this.params$.value.offset += this.params$.value.limit;
    this.params$.next(this.params$.value);
  }

  loadGroups (): Observable<Group[]> {
    return this.params$.pipe(
      switchMap((params) => {
        return this.getGroups(params);
      })
    )
  }

  queryPublic(params: {[key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi('/api/groups');
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { params: queryParams, observe: 'body', responseType: 'json' } );
  };

  getGroups(params: any) {
    return this.queryPublic(params).pipe(
      map((res: ApiResponse) => {
        this.countTotal$.next(res.data.countTotal || 0);

        return Array.from<Group>(res.data.rows);
      }),
      tap((groups) => {
        this.allGroups$ = this.allGroups$.concat(groups);
        let hasmore = false;
        if (this.allGroups$.length < this.countTotal$.value) {
          hasmore=true;
        }
        this.hasMore$.next(hasmore);
      }),
      map(() => {
        return this.allGroups$
      }),
      distinct(),
      catchError(() => EMPTY)
    );
  }
}
