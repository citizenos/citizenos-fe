import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Observable, BehaviorSubject, map, switchMap, tap, of, catchError, distinct, EMPTY } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { Group } from 'src/app/interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class PublicGroupService {
  private defaultParams = {
    showModerated:<boolean> false,
    offset:<number> 0,
    limit:<number> 8,
    orderBy: <string | null> 'name',
    order: <string | null> 'ASC',
    sourcePartnerId: <string | null> null,
    search: <string | null> null
  };
  params$ = new BehaviorSubject(this.defaultParams);
  groups$: Observable<Group[]> = of([]);
  hasMore$ = new BehaviorSubject(false);
  countTotal$ = new BehaviorSubject(0);
  page$ = new BehaviorSubject(0);

  constructor(private Location: LocationService,private http: HttpClient) {
  }

  reload() {
    this.params$.next(this.defaultParams)
  };

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

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' } );
  };

  getGroups(params: any) {
    return this.queryPublic(params).pipe(
      map((res: ApiResponse) => {
        this.countTotal$.next(res.data.countTotal || 0);

        return Array.from<Group>(res.data.rows);
      }),
      distinct(),
      catchError(() => EMPTY)
    );
  }
}
